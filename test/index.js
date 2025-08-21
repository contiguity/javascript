import { Contiguity } from '@contiguity/javascript';
const contiguity = new Contiguity('contiguity_sk_test_123');

(async () => {
    console.log(`isReady: ${contiguity.ready()}`);
    throw new Error("test");
    const response = await contiguity.text.send({
        to: "",
        message: "Hello from Contiguity!"
    });
    console.log(response);
})();