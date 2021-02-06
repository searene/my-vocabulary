#include <napi.h>
#include <VocabularyService.h>
#include <DictService.h>
#include <DictParserInitializer.h>
#include <common_helper/FileHelper.h>
#include <DictFinder.h>
#include <resource/Resource.h>
#include <common_helper/FileHelper.h>

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

Napi::Value GetResource(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  std::string url = info[0].As<Napi::String>();
  std::optional<std::unique_ptr<Resource>> resource = Resource::getResource(url);
  if (resource == std::nullopt || resource == std::nullopt) {
    throw Napi::Error::New(env, "resource is not available, url: " + url);
  }
  std::optional<std::vector<char>> resourceContents = (*resource)->getContentsAsBinaryData();
  if (resourceContents == std::nullopt) {
    throw Napi::Error::New(env, "resource is not available, url: " + url);
  }
  return Napi::Buffer<char>::Copy(env, resourceContents->data(), resourceContents->size());
}

Napi::Value GetResourceUrlProtocol(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  const UTF8String& protocol = Resource::getResourceUrlProtocol();
  return Napi::String::New(env, protocol);
}

Napi::Value GetResourceMimeType(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  const UTF8String& resourceUrl = info[0].As<Napi::String>();
  std::optional<std::unique_ptr<Resource>> resource = Resource::getResource(resourceUrl);
  if (resource == std::nullopt || resource == std::nullopt) {
    throw Napi::Error::New(env, "resource is not available, url: " + resourceUrl);
  }
  return Napi::String::New(env, (*resource)->getMimeType());
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  DictParserInitializer::init();
  exports.Set(Napi::String::New(env, "getSuggestedWords"), Napi::Function::New(env, GetSuggestedWords));
  exports.Set(Napi::String::New(env, "getHtml"), Napi::Function::New(env, GetHtml));
  exports.Set(Napi::String::New(env, "getResource"), Napi::Function::New(env, GetResource));
  exports.Set(Napi::String::New(env, "getResourceUrlProtocol"), Napi::Function::New(env, GetResourceUrlProtocol));
  exports.Set(Napi::String::New(env, "getResourceMimeType"), Napi::Function::New(env, GetResourceMimeType));
  return exports;
}

NODE_API_MODULE(addon, Init);
