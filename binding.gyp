{
  "targets": [
    {
      "target_name": "DictParser",
      "sources": [ "src/cpp/DictParser.cpp" ],
      "link_settings": {
        "libraries": [
          "-L/home/searene/CLionProjects/DictParser/build",
          "-Wl,-rpath=/home/searene/CLionProjects/DictParser/build"
          ]
      },
      "libraries": [
        "-lDictParser"
      ],
      "include_dirs": [
        "/home/searene/CLionProjects/DictParser/include",
        "/home/searene/CLionProjects/DictParser/subprojects/minilzo-2.10",
        "/home/searene/CLionProjects/DictParser/subprojects/lexbor/source",
        "<!(node -p \"require('node-addon-api').include_dir\")"
      ],
      "cflags_cc": [
        "-std=c++17",
        "-fexceptions"
      ],
    }
  ]
}