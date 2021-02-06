# my-vocabulary

## Prerequsites

### Install Boost

``` bash
sudo pacman -S boost
```

### build DictParser

This step is essential when using a new system, you cannot use previously built binaries because the binary contains previously linked libraries(e.g. boost) with a different location than your current system.

Go to `${DictParserProjectRoot}/build`, then execute

``` bash
cmake ..
make
```
