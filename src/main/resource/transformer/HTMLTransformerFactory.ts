import { SoundHTMLTransformer } from "./SoundHTMLTransformer";

const soundHTMLTransformer = new SoundHTMLTransformer();

export const htmlTransformers = [soundHTMLTransformer];

export const transform = async (contents: string): Promise<string> => {
  let result = contents;
  for (const htmlTransformer of htmlTransformers) {
    result = await htmlTransformer.transformHTML(contents);
  }
  return result;
}