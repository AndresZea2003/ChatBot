import {PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer";
import {CheerioWebBaseLoader} from "langchain/document_loaders/web/cheerio";

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

const scrappedDocContent = [];
let data = []
const loader = new PuppeteerWebBaseLoader('https://placetopay-docs.placetopay.ws/create-session', {
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

        // Función para agregar una sección al array
        function addSection(title, content) {
            sections.push({title, content});
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

        return {
            documentation: sections,
            url: 'URL AQUI'
        }
    },
});


async function yep() {
    const docs = await loader.load();
    console.log(docs[0].pageContent);
}

yep()