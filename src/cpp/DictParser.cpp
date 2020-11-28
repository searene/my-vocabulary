#include <napi.h>
#include <VocabularyService.h>
#include <DictParserInitializer.h>


Napi::Value GetSuggestedWords(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  std::string word = info[0].As<Napi::String>();
  DictParserInitializer::init();
  std::vector<UTF8String> suggestedWords = VocabularyService::vocab.getStringPrefixedWith(word, 20);
  Napi::Array result = Napi::Array::New(env);
  for (size_t i = 0; i < suggestedWords.size(); i++) {
    result.Set(i, Napi::String::New(env, suggestedWords[i]));
  }
  return result;
}

Napi::Value Add(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  double arg0 = info[0].As<Napi::Number>().DoubleValue();
  double arg1 = info[1].As<Napi::Number>().DoubleValue();
  Napi::Number num = Napi::Number::New(env, arg0 + arg1);

  return num;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "getSuggestedWords"), Napi::Function::New(env, GetSuggestedWords));
  return exports;
}

NODE_API_MODULE(addon, Init);
