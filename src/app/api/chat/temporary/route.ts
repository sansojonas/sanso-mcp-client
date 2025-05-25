import { redirect } from "next/navigation";
import { auth } from "../../auth/auth";
import { Message, smoothStream, streamText } from "ai";
import { customModelProvider } from "lib/ai/models";
import logger from "logger";
import { buildUserSystemPrompt } from "lib/ai/prompts";
import { userRepository } from "lib/db/repository";

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const session = await auth();

    if (!session?.user.id) {
      return redirect("/login");
    }

    const { messages, model: modelName } = json as {
      messages: Message[];
      model: string;
    };

    const model = customModelProvider.getModel(modelName);

    const userPreferences =
      (await userRepository.getPreferences(session.user.id)) || undefined;

    return streamText({
      model,
      system: buildUserSystemPrompt(session, userPreferences),
      messages,
      maxSteps: 10,
      experimental_continueSteps: true,
      experimental_transform: smoothStream({ chunking: "word" }),
    }).toDataStreamResponse();
  } catch (error: any) {
    logger.error(error);
    return new Response(error.message || "Oops, an error occured!", {
      status: 500,
    });
  }
}
