// 对每个元素节点的指令进行解析，根据指令模板替换数据，以及绑定相应的更新函数
import { CompileUtil } from './CompileUtil';

function Compile(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    this.$component = document.getElementById(this.$vm.$options.id);
    if (this.$el !== null) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = vm.$options.template;
        this.$fragment = this.generateFragment(tempDiv);
        this.compileNode(this.$fragment);
        if (this.$component && this.$component.dataset.serverRendered) {
            this.$el.replaceChild(this.$fragment, this.$component);
        } else {
            this.$el.appendChild(this.$fragment);
        }
    }
}
Compile.prototype = {
    generateFragment(el) {
        const fragment = document.createDocumentFragment();
        let child = el.firstChild;
        // 如果fragment.appendChild是已有的元素，会从文档里移除
        while (child) {
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    },
    compileNode(fragment) {
        const { childNodes } = fragment;
        const self = this;
        [].slice.call(childNodes).forEach(node => {
            const { nodeType } = node;
            switch (nodeType) {
                // 元素节点
                case 1:
                    self.compileElement(node, node.childNodes);
                    break;
                // 文本节点
                case 3:
                    const matches = node.nodeValue.match(/\{\{(.*)\}\}/);
                    // 提取到模版中{{ property }}格式
                    if (matches) {
                        [CompileUtil.brace] = matches;
                        self.compileText(node, matches[1].replace(/\s*/g, ''));
                    }
                    break;
                default:
                    break;
            }
            if (node.childNodes && node.childNodes.length) {
                self.compileNode(node);
            }
        });
    },
    compileElement(node) {
        const nodeAttributes = node.attributes;
        const self = this;
        [].slice.call(nodeAttributes).forEach(attribute => {
            const attributeName = attribute.name;
            if (self.isDirective(attributeName)) {
                const property = attribute.value;
                // v-on:click=>on:click
                const directive = attributeName.substring(2);
                // 事件指令
                if (self.isEventDirective(directive)) {
                    CompileUtil.eventHandler(
                        node,
                        self.$vm,
                        property,
                        directive,
                    );
                } else if (self.isForDirective(directive)) {
                    CompileUtil[directive] &&
                        CompileUtil[directive](
                            node,
                            self.$vm,
                            property,
                            node.innerHTML,
                        );
                } else {
                    // 普通指令
                    CompileUtil[directive] &&
                        CompileUtil[directive](node, self.$vm, property);
                }
                // 移除编译过的属性
                node.removeAttribute(attributeName);
            }
        });
    },
    compileText(node, property) {
        CompileUtil.text(node, this.$vm, property);
    },
    isDirective(attributeName) {
        return attributeName.indexOf('v-') === 0;
    },
    isEventDirective(directive) {
        return directive.indexOf('on') === 0;
    },
    isForDirective(directive) {
        return directive.indexOf('for') === 0;
    },
};
export default Compile;
