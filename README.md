# kkb-download

## 问题&方案

1. 循环嵌套 ora 不能正常工作，存在 spinner 嵌套
2. ora 实际运用 process.stderr.write('aa')输出
3. 要实现多个 spinne 同时工作，则 process.stderr.write 需要打印所有的 spinner

## TODO

1. 解决 多个 spinner 同时工作问题，可以尝试写一个心得 spinner
