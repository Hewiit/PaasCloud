# K7s

------

​	A PaaS platform based on Kubernetes aka K8s.

| Key            | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| version        | initial                                                      |
| create date    | 20211018                                                     |
| deployment URL | none                                                         |
| git URL        | https://github.com/Adminext/k7s (*note that this repository is currently public*) |

## Project Structure

```bash
k7s
	doc/ 文档目录，请将属于整个项目的文档、属于项目局部但较为复杂的文档放到这里
	dist/ webpack打包输出目录，已加入.gitignore
	node_modules/ npm模块目录，已加入.gitignore
	public/ 静态资源目录，请将大量的静态资源文件（如某些经常切换的图片）和第三方库放在这里。如果@/assets/目录下资源文件无法访问，将其转移到此处
		favicon.ico 页面图标文件
		index.html 项目入口html文件，在此处引入无法通过npm引入的包
	src/ 代码目录@
    	api/ 封装起来的api列表
    		api.js api的入口文件
    		${path}/ @/views/${path}目录下的页面的api
             common/ @/views/目录下有多个页面使用的api
             test/ 用于测试的api
        assets/ 参与打包的静态资源目录，请将固定且使用次数较少的静态资源（如背景图、图标、假数据、第三方库）放在这里
        	img/ 图片目录
        		${path}/ @/views/${path}或@/components/${path}目录下的页面、组件使用的资源
        	lib/ 第三方库目录
        	font/ 字体文件（.ttf .woff)目录
        components/ 组件目录
        	tmp/ 临时组件目录，用于临时堆放开发中的组件。请注意，一旦确定了组件所属的位置，请立即将其从该目录移走！该目录在gitignore中
        	utils/ 工具组件目录，放置封装的工具组件（如特殊的输入控件等等）
        	views/ 一般组件目录
        		common/ 放置在多处使用的组件
        		${path}/ 在@/views/${path}目录下的页面使用的组件
        plugins/ vue-cli插件目录，现在里面就一个vuetify
        router/ vue-router路由目录，现在里面只维护一个index.js。更改路由表后务必在群里喊一声，并在commit信息中说明
        store/ vuex状态管理目录，现在里面只有index.js，酌情添加文件
        style/ 一些css样式的目录
        	index.css 全局css，在App.vue中被引入
        	font-iceland.css iceland字体的fontface文件
        utils/ 工具目录，放置封装好的工具
        	httpRequest/ 封装了axios
        	validatingRules/ 封装了字段验证的正则表达式和函数
        	localStorage/ 请将所有对localStorage的crud都在这里写个js封装
        	prototype/ 一些添加到Vue原型链上的工具放在这里
        views/ 主要的页面目录
        	public/ 外页目录（即不需要登录的对外展示页面）
        	private/ 内页目录（即需要登录的后台页面）
        	test.vue 测试用页面，这个页面在gitignore中，请随意使用
        App.vue 项目根组件，现在是v-app
        main.js 项目入口js，请在此处进行全局引入操作
    .browserslistrc 浏览器兼容配置文件，动之前说一声
    .eslintrc.js eslint配置文件，动之前说一声
    babel.config.js babel配置文件，动之前说一声
    package.json npm依赖项，不要手动修改，merge时发生冲突请谨慎操作
    package-lock.json npm依赖项，不要手动修改，merge时发生冲突请谨慎操作
    README.md 项目的readme，也就是这个文件
    vue.config.js vue配置文件，动之前说一声
    Dockerfile 这是部署时使用的dockerfile
```

## Development and Deployment

​	Please use `npm` rather than `yarn`.

```bash
npm install #Install dependencies according to package.json. Reccommended to run with every pull.
npm run serve #Start up webpack development server.
npm run build #Build with webpack, output in /dist/.
```

​	**Proxy config for development context can be found in `/vue.config.js`.**
