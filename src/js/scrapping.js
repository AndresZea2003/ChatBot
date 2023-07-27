import {PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer";
import {CheerioWebBaseLoader} from "langchain/document_loaders/web/cheerio";
import {FaissStore} from "langchain/vectorstores/faiss";
import {OpenAIEmbeddings} from "langchain/embeddings";
import {JSONLoader} from "langchain/document_loaders/fs/json";
import {OpenAI} from "langchain/llms/openai";
import {PromptTemplate} from 'langchain/prompts';
import {LLMChain, ConversationChain} from 'langchain/chains';

import fs from 'node:fs';

const urls_wc = ["https://placetopay-docs.placetopay.ws/",
    "https://placetopay-docs.placetopay.ws/how-checkout-works",
    "https://placetopay-docs.placetopay.ws/plugins",
    "https://placetopay-docs.placetopay.ws/lightbox",
    "https://placetopay-docs.placetopay.ws/authentication",
    "https://placetopay-docs.placetopay.ws/create-session",
    "https://placetopay-docs.placetopay.ws/localization",
    "https://placetopay-docs.placetopay.ws/security",
    "https://placetopay-docs.placetopay.ws/document-types",
    "https://placetopay-docs.placetopay.ws/tax-details",
    "https://placetopay-docs.placetopay.ws/payment-methods",
    "https://placetopay-docs.placetopay.ws/test-your-integration",
    "https://placetopay-docs.placetopay.ws/notification",
    "https://placetopay-docs.placetopay.ws/changelog",
    "https://placetopay-docs.placetopay.ws/api-policy",
    "https://placetopay-docs.placetopay.ws/api-reference/session",
    "https://placetopay-docs.placetopay.ws/api-reference/payment",
    "https://placetopay-docs.placetopay.ws/api-reference/token"
]

// const loader = new PuppeteerWebBaseLoader('https://placetopay-docs.placetopay.ws/create-session', {
//     async evaluate(page, browser) {
//         const dataFromWeb = await page.$eval('main.py-16', (element) => element.innerHTML);
//
//         let modifiedData = "";
//         modifiedData = dataFromWeb.replace(/<article[^>]*>/g, '').replace(/<\/article>/g, '');
//         modifiedData = modifiedData.replace(/<svg[^>]*>/g, '').replace(/<\/svg>/g, '');
//         modifiedData = modifiedData.replace(/<path[^>]*>/g, '').replace(/<\/path>/g, '');
//         modifiedData = modifiedData.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '');
//         modifiedData = modifiedData.replace(/<img[^>]*>/g, '');
//         modifiedData = modifiedData.replace(/<button[^>]*>/g, '');
//         modifiedData = modifiedData.replaceAll(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
//         modifiedData = modifiedData.replace(/<a[^>]*>/g, '').replace(/<\/a>/g, '');
//         modifiedData = modifiedData.replace(/<dd[^>]*>/g, '').replace(/<\/dd>/g, '');
//         modifiedData = modifiedData.replace(/<dt[^>]*>/g, '').replace(/<\/dt>/g, '');
//         modifiedData = modifiedData.replace(/<hr[^>]*>/g, '');
//         modifiedData = modifiedData.replace(/CopyCopied!/g, '');
//
//         // Cargar el contenido HTML en Cheerio
//         const {load} = await CheerioWebBaseLoader.imports();
//         const $ = load(modifiedData);
//
//         // Array para almacenar las secciones
//         const sections = [];
//
//         // Función para agregar una sección al array
//         function addSection(title, content) {
//             // sections.push([title, content]);
//             sections.push({content: `title: ${title} \n Content: ${content} \n url: 'URL_XD'`});
//         }
//
//         // Itera sobre las etiquetas h1, h2, h3 y h4 para identificar las secciones
//         $('h1, h2').each((index, element) => {
//             const title = $(element).text().trim();
//             // const content = $(element).nextUntil('h1, h2, h3, h4').not('script').toArray().map(el => $.html(el)).join('');
//             const content = $(element).nextUntil('h1, h2').not('script').toArray().map(el => $(el).text()).join('');
//             addSection(title, content);
//         });
//
//         // Muestra las secciones en la consola
//         sections.forEach((section, index) => {
//             // logs
//             // console.log(`\nSección ${index + 1}: ${section.title}\n`);
//             // console.log(section.content);
//         });
//
//         // Opcional: Guarda las secciones en archivos separados
//         sections.forEach((section, index) => {
//             // Puedes guardar las secciones en archivos separados aquí
//             // fs.writeFileSync(`seccion_${index + 1}.html`, section.content);
//         });
//         // scrappedDocContent.push(scrappedData);
//
//
//         return JSON.stringify({
//             "sections": sections
//         }, null, 2)
//
//     },
// });


async function scrapeUrls(urls) {
    const scrappedDocs = [];
    let docsDate = []

    for (const url of urls) {
        const loader = new PuppeteerWebBaseLoader(url, {
            async evaluate(page, browser) {

                const dataFromWeb = await page.$eval('main.py-16', (element) => element.innerHTML);

                let modifiedData = "";
                modifiedData = dataFromWeb.replace(/<article[^>]*>/g, '').replace(/<\/article>/g, '');
                modifiedData = modifiedData.replace(/<svg[^>]*>/g, '').replace(/<\/svg>/g, '');
                modifiedData = modifiedData.replace(/<path[^>]*>/g, '').replace(/<\/path>/g, '');
                modifiedData = modifiedData.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '');
                modifiedData = modifiedData.replace(/<img[^>]*>/g, '');
                modifiedData = modifiedData.replace(/<button[^>]*>/g, '');
                modifiedData = modifiedData.replaceAll(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
                modifiedData = modifiedData.replace(/<a[^>]*>/g, '').replace(/<\/a>/g, '');
                modifiedData = modifiedData.replace(/<dd[^>]*>/g, '').replace(/<\/dd>/g, '');
                modifiedData = modifiedData.replace(/<dt[^>]*>/g, '').replace(/<\/dt>/g, '');
                modifiedData = modifiedData.replace(/<hr[^>]*>/g, '');
                modifiedData = modifiedData.replace(/CopyCopied!/g, '');

                // Cargar el contenido HTML en Cheerio

                const {load} = await CheerioWebBaseLoader.imports();
                const $ = load(modifiedData);

                // Array para almacenar las secciones
                const sections = [];
                let actualSection = null;

                // Función para agregar una sección al array
                function addSection(title, content) {
                    // sections.push([title, content]);
                    sections.push({content: `title: ${title} \n Content: ${content} \n url: ${url}`});
                    docsDate.push({content: `title: ${title} \n Content: ${content} \n url: ${url}`})

                }

                // Itera sobre las etiquetas h1, h2, h3 y h4 para identificar las secciones
                $('h1, h2').each((index, element) => {
                    const title = $(element).text().trim();
                    // const content = $(element).nextUntil('h1, h2, h3, h4').not('script').toArray().map(el => $.html(el)).join('');
                    const content = $(element).nextUntil('h1, h2').not('script').toArray().map(el => $(el).text()).join('');
                    addSection(title, content);
                });

                // Muestra las secciones en la consola
                sections.forEach((section, index) => {
                    // logs
                    // console.log(`\nSección ${index + 1}: ${section.title}\n`);
                    // console.log(section.content);
                });

                // Opcional: Guarda las secciones en archivos separados
                sections.forEach((section, index) => {
                    // Puedes guardar las secciones en archivos separados aquí
                    // fs.writeFileSync(`seccion_${index + 1}.html`, section.content);
                });
                // scrappedDocContent.push(scrappedData);


                return JSON.stringify({
                    "sections": sections
                }, null, 2)

            },
        });

        try {
            const scrappedData = await loader.load();

            scrappedDocs.push(scrappedData);
        } catch (error) {
            console.error(`Error al procesar la URL ${url}: ${error}`);
        }
    }

    let awba = JSON.stringify({
        "sections": docsDate
    }, null, 2)


    fs.writeFile('datos.json', awba, (err) => {
        if (err) {
            console.error(`Error al escribir el archivo JSON para la URL`);
        } else {
            console.log(`Archivo JSON creado para la URL`);
        }
    });

    return scrappedDocs;
}


async function yep() {

    let pregunta = 'Puedes crear un ejemplo de preautorizacion en python?'

    const loaderJson = new JSONLoader('datos.json');
    const docsJson = await loaderJson.load();
    // console.log(docsJson);
    const vectorStore = await FaissStore.fromDocuments(
        docsJson,
        new OpenAIEmbeddings({
            openAIApiKey: ''
        })
    );
    const similaryContext = await vectorStore.similaritySearch(pregunta, 1);

    console.log(similaryContext)
    // console.log(resultOne[0].pageContent);

    const template = "Nombre: {name} \n Rol: {role} \n Tarea: Asistente virtual especializado en la de implementación de el producto WebCheckout de la empresa PlaceToPay, que forma parte de Evertec. \n informacion de apoyo: {context} \n Condicion1: Solo puedes responder a preguntar relacionadas con tu Rol \n Condicion2: Ser un asistente muy alegre que siempre quiere ayudar \n Condicion3: Si no tienes informacion para responder una pregunta debes indicar que no cuentas con esta informacion \n Condicion4: Tienes prohibido dar información Erronea \n Condicion5: Usa la informacion de apoyo para complementar respuestas eficacez \n, Ahora ayuda a un Usuario que te dice: "

    const promptTemplate = new PromptTemplate({
        template: template,
        inputVariables: ["name", "role", "context"]
    })

    const model = new OpenAI({
        model_name: 'gpt-3.5-turbo-16k-0613',
        openAIApiKey: '',
        temperature: 0.1,
        maxTokens: 256
    })

    const chain = new ConversationChain({
        llm: model,
    })

    let formattedPrompt = await promptTemplate.format({
        name: 'Kike bot',
        role: "PlacetoPay's virtual assistant",
        // language: 'Spanish',
        context: similaryContext[0].pageContent,
    })

    let res = (await chain.call({
        input: formattedPrompt + pregunta
    })).response

    console.log(res)
}


async function updateInfo() {
    const scrappedDataArray = await scrapeUrls(urls_wc);
}

// updateInfo()
yep()