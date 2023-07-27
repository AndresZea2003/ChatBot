<script setup>
import {ref} from 'vue'
import {PromptTemplate} from 'langchain/prompts';
import {OpenAI} from "langchain/llms/openai";
import {LLMChain, ConversationChain} from 'langchain/chains';
import {JSONLoader} from "langchain/document_loaders/fs/json";
import {BufferMemory, ChatMessageHistory} from 'langchain/memory'

defineProps({
  msg: String,
})

const count = ref(0)


async function yep() {

  const loaderJson = new JSONLoader('datos.json');
  console.log(loaderJson)
  // const docsJson = await loaderJson.load();

  // const vectorStore = await FaissStore.fromDocuments(
  //     docsJson,
  //     new OpenAIEmbeddings({
  //       openAIApiKey: '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'
  //     })
  // );
  // const similaryContext = await vectorStore.similaritySearch("hay una iso para estandar?", 1);
  // // console.log(resultOne[0].pageContent);
  //
  // const template = "Nombre: {name} \n Rol: {role} \n Tarea: Asistente virtual especializado en la de implementación de el producto WebCheckout de la empresa PlaceToPay, que forma parte de Evertec. \n informacion de apoyo: {context} \n Condicion1: Solo puedes responder a preguntar relacionadas con tu Rol \n Condicion2: Ser un asistente muy alegre que siempre quiere ayudar \n Condicion3: Si no tienes informacion para responder una pregunta debes indicar que no cuentas con esta informacion \n Condicion4: Tienes prohibido dar información Erronea \n Condicion5: Usa la informacion de apoyo para complementar respuestas eficacez \n, Ahora ayuda a un Usuario que te dice: "
  //
  // const promptTemplate = new PromptTemplate({
  //   template: template,
  //   inputVariables: ["name", "role", "context"]
  // })
  //
  // const model = new OpenAI({
  //   model_name: 'gpt-3.5-turbo-16k-0613',
  //   openAIApiKey: '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',
  //   temperature: 0.1,
  //   streaming: true,
  // })
  //
  // const chain = new ConversationChain({
  //   llm: model,
  // })
  //
  // let formattedPrompt = await promptTemplate.format({
  //   name: 'Kike bot',
  //   role: "PlacetoPay's virtual assistant",
  //   // language: 'Spanish',
  //   context: similaryContext[0].pageContent,
  // })
  //
  // let res = (await chain.call({
  //   input: formattedPrompt + 'hay una iso para estandar?'
  // })).response
  //
  // console.log(similaryContext[0].pageContent)
  // console.log(res);
}

const template = "Nombre: {name} \n Rol: {role} \n Tarea: Asistente virtual especializado en la de implementación de el producto WebCheckout de la empresa PlaceToPay, que forma parte de Evertec. \n informacion de apoyo: {context} \n Condicion1: Solo puedes responder a preguntar relacionadas con tu Rol \n Condicion2: Ser un asistente muy alegre que siempre quiere ayudar \n Condicion3: Si no tienes informacion para responder una pregunta debes indicar que no cuentas con esta informacion \n Condicion4: Tienes prohibido dar información Erronea \n Condicion5: Usa la informacion de apoyo para complementar respuestas eficacez \n, Ahora ayuda a un Usuario que te dice: "

const promptTemplate = new PromptTemplate({
  template: template,
  inputVariables: ["name", "role", "context"]
})

const chatResponse = ref('')

const memory = new BufferMemory()

let messages = ref({
  message: []
})

let message_id = ref(1)

let initial1 = ref(false)

async function sendMessage() {

  let userPrompt = document.getElementById('userPrompt').value
  document.getElementById('userPrompt').value = ''

  const model = new OpenAI({
    model_name: 'gpt-3.5-turbo-16k-0613',
    openAIApiKey: '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',
    temperature: 0.1,
    streaming: true,
  })

  const chain = new ConversationChain({
    llm: model,
    memory: memory
  })
  console.log(memory)

  let formattedPrompt = await promptTemplate.format({
    name: 'Kike bot',
    role: "PlacetoPay's virtual assistant",
    context: 'La documentacion se encuentra inhabilitada'
    // language: 'Spanish',
    // context: similaryContext[0].pageContent,
  })

  let chatInput = ''
  if (initial1.value === false) {
    chatInput = formattedPrompt + userPrompt;
  } else {
    chatInput = userPrompt
  }
  chatResponse.value = (await chain.call({
    input: chatInput
  })).response

  messages.value.message.push({
    user: {
      message_id: message_id.value++,
      mySelf: true,
      text: userPrompt,
    },
    bot: {
      message_id: message_id.value++,
      mySelf: false,
      text: chatResponse.value
    }
  });

  // console.log(messages.value.message)

  initial1.value = true
}

</script>

<template>
  <div class="h-full flex justify-center items-center bg-red-200">
    <div class="bg-gray-200 pb-16 h-[80%] rounded-md shadow-md px-5 pt-5 w-[35%]">
      <div class="h-full flex-col justify-between">
        <div class="mb-5 bg-orange-300 p-4 flex justify-between">
          <div class="font-semibold text-xl">Asistente de implementacion - Kike Bot</div>
          <div>Ayuda</div>
        </div>
        <div>
          <div v-for="message in messages.message">
            <div class="bg-gray-100 flex justify-end p-4">
              <div>{{ message.user.text }}</div>
            </div>

            <div class="bg-gray-300 flex justify-start p-4">
              <!--            <div>{{ chatResponse ? chatResponse : 'Sin respuesta' }}</div>-->
              <div>{{ message.bot.text }} </div>
            </div>
          </div>

        </div>

      </div>

      <div class=" flex justify-center items-end gap-5">
        <input class="w-[70%] p-2" id="userPrompt" type="text">
        <button class="bg-orange-400 font-semibold rounded-md p-2" @click="sendMessage()">Enviar</button>
      </div>


    </div>
  </div>
</template>
