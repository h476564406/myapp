import MVVM from 'MVVM';
import styles from './homecss';

export const id = 'home';
export const template = `
    <div id=${id} style="display: none">
        <h3 class="homeTitle">Home Page: I am global class.</h3>
        <h4>History Router:&nbsp;&nbsp;<a href="/list">list link</a>&nbsp;&nbsp;<a href="/detail">detail link</a></h4>
        <h4>V-model, input something.</h4>
        <input type="text" v-model="someStr">
        <p v-class="className"> {{someStr}}</p>
        <input type="text" v-model="child.someStr">
        <p v-text="child.someStr" v-class="className"></p>  
        <h4>Computed attribute</h4>
        <p  v-class="className">{{getHelloWord}}</p>
        <h4>V-on:click  <button v-on:click="clickBtn">Change data</button></h4>
        <h4>V-html</h4>
        <div v-html="child.htmlStr"></div>
        <h4>V-for</h4>
        <ul v-for="item in items">
            <li v-on:click="clickMe">{{ item.name }} {{ item.message }}</li>
        </ul>
    </div>
`;
export default new MVVM({
    // 多个空白符和换行符号会被html解析器处理成一个空白，要用&nbsp;或者<br>
    template,
    id,
    el: '#app',
    data() {
        return {
            someStr: 'Hello',
            className: styles.yellow,
            child: {
                someStr: 'World !',
                htmlStr:
                    '<p>I am generated by<strong style="color: red">&nbsp;v-html</strong></p>',
            },
            items: [
                { name: '曹操', message: '周公吐哺，天下归心' },
                { name: '荀彧', message: '奉天子以令诸侯' },
            ],
        };
    },
    computed: {
        getHelloWord() {
            return `${this.someStr}  ${this.child.someStr}`;
        },
    },
    methods: {
        clickBtn() {
            const randomStrArr = ['郭嘉', '典韦', '夏侯惇'];
            this.someStr = randomStrArr[parseInt(Math.random() * 3, 10)];
            this.child.someStr = randomStrArr[parseInt(Math.random() * 3, 10)];
        },
        clickMe() {
            alert('人物');
        },
    },
});
