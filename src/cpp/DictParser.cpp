#include <napi.h>
#include <VocabularyService.h>
#include <DictService.h>
#include <DictParserInitializer.h>

Napi::Value GetSuggestedWords(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  std::string word = info[0].As<Napi::String>();
  std::vector<UTF8String> suggestedWords = VocabularyService::vocab.getStringPrefixedWith(word, 20);
  Napi::Array result = Napi::Array::New(env);
  for (size_t i = 0; i < suggestedWords.size(); i++) {
    result.Set(i, Napi::String::New(env, suggestedWords[i]));
  }
  return result;
}

Napi::Value GetHtml(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  std::string word = info[0].As<Napi::String>();
  std::string html = DictService::getHtml(word);
  return Napi::String::New(env, html);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  DictParserInitializer::init();
  exports.Set(Napi::String::New(env, "getSuggestedWords"), Napi::Function::New(env, GetSuggestedWords));
  exports.Set(Napi::String::New(env, "getHtml"), Napi::Function::New(env, GetHtml));
  return exports;
}

NODE_API_MODULE(addon, Init);
