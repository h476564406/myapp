export function render() {
    return `
    <div id='home' data-server-rendered="true">
        <h3>Home Page: I am global class.</h3>
        <h4>History Router:&nbsp;&nbsp;<a href="/list">list link</a>&nbsp;&nbsp;<a href="/detail">detail link</a></h4>
        <h4>V-model, input something.</h4>
        <input type="text" value="Hello">
        <p>Hello</p>
        <input type="text" value="World !">
        <p>World !</p>  
        <h4>Computed attribute</h4>
        <p>Hello World !</p>
        <h4>V-on:click  <button>Change data</button></h4>
        <h4>V-html</h4>
        <div><p>I am generated by<strong style="color: red">&nbsp;v-html</strong></p></div>
        <h4>V-for</h4>
        <ul style="padding:15px">
            <li>曹操 周公吐哺，天下归心</li>
            <li>荀彧 奉天子以令诸侯</li>
        </ul>
    </div>`;
}