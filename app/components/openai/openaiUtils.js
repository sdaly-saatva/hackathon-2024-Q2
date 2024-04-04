async function retrieveAssistant(openai, newAssistant) {
    const assistant = await openai.beta.assistants.retrieve(newAssistant);
    console.log(assistant)
    // const assistantDetails = assistant.data;
    // console.log('Assistant Details:', assistantDetails);
    // // Access the description or instructions from the assistantDetails object
    // console.log('Assistant Description:', assistantDetails.description);
    // console.log('Assistant Instructions:', assistantDetails.instructions);
    return assistant.id
}

async function createThread(openai) {
    const emptyThread = await openai.beta.threads.create();
    return emptyThread.id
}

async function createMessage(openai, thread, question) {
    const threadMessages = await openai.beta.threads.messages.create(
        thread,
        {
            role: "user",
            content: question
        }
    );
    return threadMessages.id
}

async function createRun(openai, thread, assistantId) {
    const run = await openai.beta.threads.runs.create(
        thread,
        {
            assistant_id: assistantId,
            instructions: "Always Introduce Yourself"
        }
    );
    return run.id
}

function checkRunStatus(openai, thread, run) {
    return new Promise((resolve, reject) => {
        const checkStatus = async () => {
            try {
                const runStatus = await openai.beta.threads.runs.retrieve(thread, run);
                if (runStatus.status !== 'completed') {
                    setTimeout(checkStatus, 5000);
                } else {
                    resolve(runStatus);
                }
            } catch (error) {
                reject(error);
            }
        };
        checkStatus();
    });
}

async function newMessage(openai, thread) {
    try {
        const listMessages = await openai.beta.threads.messages.list(thread);
        if (listMessages.data.length > 0) {
            return listMessages.data[0].id;
        } else {
            return null; 
        }
    } catch (error) {
        throw error; 
    }
}

async function results(openai, thread, lastMessage) {
    if (!lastMessage) {
        return ''; // Or handle this scenario as needed.
    }

    try {
        const result = await openai.beta.threads.messages.retrieve(thread, lastMessage);
        return result.content && result.content.length > 0 ? result.content[0].text.value : '';
    } catch (error) {
        throw error; // Rethrow to be caught by the caller.
    }
}

export async function newChat(question, openai) {
    try {
        // Example placeholders for your API function calls
        // const assistantId = await create_assistant();
        console.log('STARTING THREAD')
        const assistantId = await retrieveAssistant(openai, 'asst_SLiDDZI0PakNbt4L4hpvT3QR')
        // const assistantId ='asst_SLiDDZI0PakNbt4L4hpvT3QR'
        const thread = await createThread(openai); // Ensure this returns a valid thread ID.
        await createMessage(openai, thread, question)
        const run = await createRun(openai,thread, assistantId)
        await checkRunStatus(openai,thread, run);
        const last_message = await newMessage(openai,thread)
        const result = await results(openai, thread, last_message)
        console.log('FINISHED', result)
        return result
    } catch (error) {
        console.error('Error in assistant operations:', error)
    }
}