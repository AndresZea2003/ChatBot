<script setup>
import {ref} from 'vue'
import {PromptTemplate} from 'langchain/prompts';
import {OpenAI} from "langchain/llms/openai";
import {LLMChain, ConversationChain} from 'langchain/chains';
import {JSONLoader} from "langchain/document_loaders/fs/json";
import {BufferMemory, ChatMessageHistory} from 'langchain/memory'
import axios from "axios";

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

const subTemplate = 'informacion de apoyo: {context}, el usuario dice: '

const promptTemplate = new PromptTemplate({
  template: template,
  inputVariables: ["name", "role", "context"]
})

const subPromptTemplate = new PromptTemplate({
  template: subTemplate,
  inputVariables: ["context"]
})

const chatResponse = ref('')

const memory = new BufferMemory()

let messages = ref({
  message: []
})

let message_id = ref(1)

let initial1 = ref(false)

let responseAxios = ref(null)

const backendUrl = 'http://localhost:3000';

const backendInfoGet = async () => {
  try {
    const response = await axios.get(`${backendUrl}/tu-endpoint`);
    console.log(response.data); // Aquí se mostrarán los resultados en la consola del navegador
  } catch (error) {
    console.error(error);
  }
};

let contextBackend = ref(null)

const cargarContexto = async (pregunta, key) => {
  try {
    const response = await axios.post('http://localhost:3000/cargar-contexto', {
      pregunta,
      key
    });
    const resultado = response.data.result;

    console.log(resultado[0].pageContent); // Aquí puedes hacer lo que desees con el resultado, como mostrarlo en el frontend

    contextBackend.value = resultado[0].pageContent
  } catch (error) {
    console.error(error);
  }
};

const loading = ref(false)
let temporalPrompt = ref('')

async function sendMessage() {

  document.getElementById('logo').classList.replace('opacity-80', 'opacity-0')
  setTimeout(function (){
    document.getElementById('logo').classList.add("hidden")
  }, 1000)

  let userPrompt = document.getElementById('userPrompt').value

  temporalPrompt.value = userPrompt

  document.getElementById('userPrompt').value = ''

  try {
    loading.value = true;
    const response = await axios.post('http://localhost:3000/cargar-contexto', {
      pregunta: userPrompt,
      key: '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'
    });
    const resultado = response.data.result;

    console.log(resultado[0].pageContent); // Aquí puedes hacer lo que desees con el resultado, como mostrarlo en el frontend

    const model = new OpenAI({
      model_name: 'gpt-3.5-turbo-16k-0613',
      openAIApiKey: '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',
      temperature: 0.1,
      streaming: true,
      maxTokens: 412
    })

    const chain = new ConversationChain({
      llm: model,
      memory: memory
    })

    let formattedPrompt = await promptTemplate.format({
      name: 'Kike bot',
      role: "PlacetoPay's virtual assistant",
      context: resultado[0].pageContent
      // language: 'Spanish',
      // context: similaryContext[0].pageContent,
    })

    let subFormattedPrompt = await subPromptTemplate.format({
      context: resultado[0].pageContent
    })

    console.log("template dice: " + formattedPrompt)
    console.log("SUBtemplate dice: " + subFormattedPrompt)

    let chatInput = ''
    if (initial1.value === false) {
      chatInput = formattedPrompt + userPrompt;
    } else {
      chatInput = subFormattedPrompt + userPrompt
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

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }


}

const refresh = () => {
  window.location.href = "http://localhost:5173/";

}

</script>

<template>

  <div>
    <apple-pay-button @click="" buttonstyle="black" type="plain" locale="en"></apple-pay-button>
  </div>

  <div class="h-full flex justify-center items-center bg-stone-900">

    <div id="logo" class="fixed opacity-80 duration-300" style="left: 36%; top: 40%; z-index: 1">
      <img src="/placetopay-logo-black.svg" width="400" alt="">
      <div class="flex justify-center">
        <div class="text-xl font-semibold pt-5">
          <div>X</div>
        </div>
      </div>
      <div class="flex justify-center pt-5">
        <img src="/OpenAI_Logo.svg" width="200" alt="">
      </div>
    </div>

    <div class="bg-gray-200 mb-16 pb-16 h-[80%] rounded-md shadow-md px-5 pt-5 w-[35%] overflow-auto" style="z-index: 0">
      <div>

        <div class="fixed left-0 top-0 h-[10%] mt-14 w-screen flex justify-center items-end">
          <div class="mb-5 bg-orange-400 p-4 flex justify-between rounded-t-md w-[34%]">
            <div class="font-semibold text-xl text-white">Asistente de implementacion - Kike Bot - IA</div>
            <button class="bg-stone-900 p-1 rounded-md text-gray-300 hover:opacity-50 hover:scale-90" @click="refresh()">
              <svg fill="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14.928 23.617c-.759.211-1.551.341-2.367.383l.085-2.026c.559-.041 1.104-.124 1.631-.263l.651 1.906zm3.396-19.595c-.651-.458-1.354-.847-2.098-1.157l-.623 1.914c.508.223.98.506 1.435.815l1.286-1.572zm-17.127 6.911c-.13.676-.198 1.374-.198 2.088l.021.402 1.985-.278-.006-.124c0-.504.049-.996.129-1.477l-1.931-.611zm17.914-6.295l-1.27 1.553c.448.384.845.821 1.211 1.285l1.626-1.208c-.464-.597-.99-1.142-1.567-1.63zm-14.588 3.398c1.442-2.148 3.79-3.647 6.49-3.947v1.932l2.991-2.996-2.991-3.004v2.05c-3.455.309-6.454 2.219-8.245 4.979l1.755.986zm10.701 13.359l.655 1.916c.737-.28 1.438-.635 2.09-1.058l-1.24-1.588c-.472.292-.981.526-1.505.73zm-13.791-11.437l1.91.604c.166-.582.392-1.139.667-1.668l-1.747-.981c-.342.647-.623 1.33-.83 2.045zm20.151 8.43c.895-1.589 1.416-3.414 1.416-5.367 0-2.188-.645-4.223-1.746-5.936l-1.621 1.205c.857 1.376 1.367 2.992 1.367 4.731 0 1.604-.442 3.097-1.18 4.402l-1.763-.964 1.193 4.072 4.072-1.192-1.738-.951zm-9.94 3.608c-3.181-.126-5.94-1.898-7.44-4.499l1.769-1.026-4.103-1.088-1.089 4.1 1.695-.983c1.829 3.175 5.195 5.335 9.084 5.491l.084-1.995z"/></svg>
            </button>
          </div>
        </div>

        <div class="h-[80%] flex-col justify-between pt-16">

          <div>
            <div v-for="message in messages.message">
              <div class="bg-gray-100 flex justify-end items-center p-4 shadow-md" >
                <div class="mr-3 ml-12 w-[90%] flex justify-end">
                  <span>{{ message.user.text }}</span>
                </div>
                <div class="w-[10%]">
                  <img src="/user-icon.svg" class="rounded-full" width="50" alt="">
                </div>
              </div>

              <div class="bg-gray-300 flex justify-start p-4 my-2 shadow-md">
                <!--            <div>{{ chatResponse ? chatResponse : 'Sin respuesta' }}</div>-->
                <div class="w-[10%]">
                  <img src="/robot.png" width="60" alt="">
                </div>
                <div class="mr-12 ml-3 w-[90%]">{{ message.bot.text }}</div>
              </div>
            </div>

            <div v-if="loading" class="bg-gray-100 flex justify-end items-center p-4 shadow-md">
              <div class="mr-3 ml-12 w-[90%] flex justify-end">
                <span>{{ temporalPrompt }}</span>
              </div>
              <div class="w-[10%]">
                <img src="/user-icon.svg" class="rounded-full" width="50" alt="">
              </div>
            </div>

            <div v-if="loading" class="bg-gray-300 flex justify-start items-center p-4 my-2 shadow-md">
              <!--            <div>{{ chatResponse ? chatResponse : 'Sin respuesta' }}</div>-->
              <div class="">
                <img src="/robot.png" width="50" alt="">
              </div>
              <div class="mr-12 ml-3 flex w-[90%]">
                <div class="load-row">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>


    <div class="fixed left-0 bottom-0 h-[10%] w-screen flex justify-center items-end">
      <div class="flex justify-center items-end gap-5 mb-10 w-[35%] bg-gray-400 p-5 rounded-md">
        <input v-on:keyup.enter="sendMessage()" class="w-[80%] p-2" id="userPrompt" type="text" placeholder="Escribe tu pregunta">
        <button class="bg-orange-400 font-semibold rounded-md p-2 text-white" @click="sendMessage()">Enviar</button>
      </div>
    </div>

  </div>
</template>
<style>

.load-row {
  width: 100px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

.load-row span {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #f76002;
  border-radius: 50px;
  animation: up-down6 0.5s ease-in infinite alternate;
}

.load-row span:nth-child(2) {
  background: #e85b04c4;
  animation-delay: 0.16s;
}

.load-row span:nth-child(3) {
  background: #e85b0491;
  animation-delay: 0.32s;
}

.load-row span:nth-child(4) {
  background: #e85b0456;
  animation-delay: 0.48s;
}

@keyframes up-down6 {
  0% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(10px);
  }
}
</style>