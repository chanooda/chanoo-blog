interface Regex {
  getWriteDescription: (text?: string) => string;
  // imageFormat: RegExp;
  markdownImage: RegExp;
  markdownTitle: RegExp;
  url: RegExp;
}

export const regex: Regex = {
  url: /(|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/g,
  markdownTitle: /#{1,6}\s[\w|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]+/g,
  markdownImage: /!\[[^)]*\]\([^)]*\)*/g,
  getWriteDescription(text) {
    if (!text) return '';
    return text
      .replace(this.url, '')
      .replace(this.markdownTitle, '')
      .replace(this.markdownImage, '');
    // .replace(this.imageFormat, '');
  }
};
