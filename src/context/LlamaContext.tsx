import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { initLlama, LlamaContext as LlamaContextType } from "llama.rn";
import { Message } from "../types/Message";

type LlamaContextStatus = "unloaded" | "loading" | "loaded" | "error";

interface LlamaContextProps {
    status: LlamaContextStatus;
    isGenerating: boolean;
    loadModel: (modelPath: string) => Promise<void>;
    generateResponse: (
        messages: Message[],
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    ) => Promise<void>;
    unloadModel: () => Promise<void>;
}

const LlamaContext = createContext<LlamaContextProps | undefined>(undefined);

export const LlamaProvider = ({ children }: { children: ReactNode }) => {
    const [context, setContext] = useState<LlamaContextType | null>(null);
    const [status, setStatus] = useState<LlamaContextStatus>("unloaded");
    const [isGenerating, setIsGenerating] = useState(false);

    const loadModel = useCallback(
        async (modelPath: string) => {
            if (context) await context.release();
            setStatus("loading");
            try {
                const llamaContext = await initLlama({
                    model: modelPath,
                    use_mlock: true,
                    n_ctx: 2048,
                    n_gpu_layers: 99,
                });
                setContext(llamaContext);
                setStatus("loaded");
            } catch (err) {
                console.error("Error loading Llama context:", err);
                setStatus("error");
            }
        },
        [context]
    );

    const unloadModel = useCallback(async () => {
        if (context) {
            await context.release();
            setContext(null);
            setStatus("unloaded");
        }
    }, [context]);

    const generateResponse = useCallback(
        async (
            messages: Message[],
            setMessages: React.Dispatch<React.SetStateAction<Message[]>>
        ) => {
            if (!context || status !== "loaded" || isGenerating) return;

            setIsGenerating(true);
            const stopWords = [
                "</s>",
                "<|end|>",
                "<|eot_id|>",
                "<|end_of_text|>",
                "<|im_end|>",
                "<|EOT|>",
                "<|END_OF_TURN_TOKEN|>",
                "<|end_of_turn|>",
                "<|endoftext|>",
            ];

            const formattedMessages = messages.map((msg) => ({
                role: msg.role,
                content: msg.text,
            }));

            console.log("formatted message: ", formattedMessages);

            try {
                await context.completion(
                    {
                        messages: formattedMessages,
                        n_predict: -1,
                        stop: stopWords,
                    },
                    (data) => {
                        const { token } = data;
                        setMessages((prevMessages) => {
                            const newMessages = [...prevMessages];
                            newMessages[newMessages.length - 1].text += token;
                            return newMessages;
                        });
                    }
                );
            } catch (err) {
                console.error("Error during Llama completion:", err);
                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1].text +=
                        "\n\n[Error generating response]";
                    return newMessages;
                });
            } finally {
                setIsGenerating(false);
            }
        },
        [context, status, isGenerating]
    );

    return (
        <LlamaContext.Provider
            value={{
                status,
                isGenerating,
                loadModel,
                generateResponse,
                unloadModel,
            }}
        >
            {children}
        </LlamaContext.Provider>
    );
};

export const useLlama = (): LlamaContextProps => {
    const context = useContext(LlamaContext);
    if (!context) {
        throw new Error("useLlama must be used within a LlamaProvider");
    }
    return context;
};
