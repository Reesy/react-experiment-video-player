

if (typeof(process.env.SERVING_PATH) !== 'undefined')
{
    console.log(`SERVING_PATH env var set by the host machine (or docker) to ${process.env.SERVING_PATH}`);
};

export class config 
{
    public static serving_path : string = process.env.SERVING_PATH ? process.env.SERVING_PATH : "resources";  
};