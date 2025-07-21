**Development and Testing: React Frontend, Express server, Database and `webpack-dev-server`**

**development tools `webpack-dev-server`**

* Only for development
* Automatically bundles your code and serves it from memory
* Refreshes the browser when files change (HMR)
* Compile and build React Frontend, but Frontend need manually build for production
* Does not build database or Express server
* Does not handle APIs, databases, etc. So set proxy to redirect to Express Server
* WDS set its port(3000) and proxy in config, need separate port with express server(5001) 


**Express server**

* handle APIs, database
* build server.js by `Node server.js` 
* set its own port 5001
* Sequelize + Express + GraphQL as your custom backend: frontend makes GraphQL queries to Express, which in turn uses Sequelize to talk to a local DB
* 

**Database**

* yarn add @supabase/supabase-js
* when using supabase as server, no need for express server only when..

| Use Case                         | Why You Need Express                                                           |
| -------------------------------- | ------------------------------------------------------------------------------ |
| 🔐 Use secret `service_role` key | This key can bypass Row Level Security (RLS) — it must stay on a secure server |
| 🧪 Backend-only logic            | You want to run logic that should never be exposed to clients                  |
| 🤖 Cron jobs / scheduled tasks   | Supabase doesn't run logic on a schedule — but your server can                 |
| 🔄 Integrate with other APIs     | You want to fetch from Stripe, OpenAI, etc. before storing in Supabase         |
| 📦 Proxy or batch operations     | Combine several DB/API calls into one endpoint                                 |
| 🧰 Custom GraphQL / REST API     | You want to define your own routes and formats                                 |
| 🔐 Validate or sanitize data     | Prevent bad data from reaching Supabase                                        |

**First try to build Dashboard that directly use Supabase as backend.**
* In frontend, create a file supabaseClient.js to set up url, keys. (remove data, server folder)
* post.js defines how your app fetches and creates posts(replace graphQl with Supabase) 
* set the testing button in header component. 
* edit script for not building express server.
* set AutoInsert
* run this func in App.js(entry point set in index.js, set up toast container, ReactRoute)
* remove other linkgroups in the side bar.
* in App.js(<PrivateRoute path="/app" component={LayoutComponent} />) shows content of home manage in src/components/Layout/layout.js
* in layout.js shows <Route path="/app/main" exact component={Dashboard} /> is home.
* in dashboard.js rewrite with chart.
* replace the login


* "homepage": "https://jerry93169.github.io/ReactDashboardTest",
* "build": "cross-env PUBLIC_URL='/ReactDashboardTest' react-app-rewired build",
* public/index <base href="/ReactDashboardTest/" />
* remember to clean the cache

Recharts automatically hides labels if:
The label text would overlap with another label
There’s not enough room in the SVG canvas to render the label without collision
The slice is too small — if the angle is very narrow, Recharts won't render the label



**FrontEnd**

* When building production, since the code is already test, we can manually build by webpack 

**steps**

* `npx webpack serve` launch the WDS(just a node.js script, haven't listened to port)
* WDS ask webpack read config
* Webpack sets up Loaders, Plugins, Entry/output, DevServer config
* Webpack compile app
* WDS reads DevServer config, set port, directory, browser-open, proxy then start Http server(WDS)
* Compiled frontend is served from memory by WDS 

**real**

* run `yarn dev` to start WDS and express server
* if wanna change the port of express server change the port in server.js and json.package and .env
* connect to supabase




---

## 🔧 Server-Side: What `webpack-dev-server` Does

### 1. **Run Webpack**

webpack is chef who prepare the food, wds is the kitchen

Webpack reads the `webpack.config.js`(**tells Webpack how to build app**). 
Then read index.js(which conclude all the files, eg. import './styles.css')
bundle all the files into single file **bundle.js** and all style into **style.css** by **removing unused code** and **transforming all files by loader**.  

Webpack uses loaders to transform non-JavaScript files (like .css, .png, .ts, etc.) into JavaScript modules — because the browser can only run JavaScript.

| File Type     | Transformed Into                              | Why                                                  |
|---------------|-----------------------------------------------|-------------------------------------------------------|
| `.js`  | Browser-compatible JavaScript               | Babel or TypeScript transpiles typed code     |
| `.css`        | JavaScript that injects CSS into `<style>` tags | So styles are loaded dynamically in JS               |
| `.png` / `.jpg` | JavaScript exporting a URL or base64 string    | So the image can be imported like a module           |
| `.svg`        | Inline SVG or a JS URL string                  | Same reason as above                                 |
| `.json`       | Parsed JS object                               | So you can `import data from './data.json'`          |


**webpack.config.js:**

| Section        | What It Controls                             | Example                                       |
| -------------- | -------------------------------------------- | --------------------------------------------- |
| `entry`        | Where your app starts                        | `'./src/index.js'`                            |
| `output`       | Where to put the bundled file                | `'./dist/bundle.js'`                          |
| `module.rules` | How to handle different file types           | Use Babel for `.js`, loaders for `.css`, etc. |
| `plugins`      | Extra functionality                          | HMR, HTML template injection, etc.            |
| `devServer`    | WDS behavior  | Port, HMR, open browser, etc.                 |
| `mode`         | Optimize for development or production       | `'development'` or `'production'`             |
 
**Webpack only ignore the 'devServer', WDS will read config when it need the settings.**
**Webpack Sets up loaders and registers plugins.(like the staff in kitchen)**
They can help Webpack finish its works.
Plugin would modify the bundle every time webpack need them by listening to the emit.

- **HtmlWebpackPlugin**: Creates /dist/index.html(open-1st file), Injects `<script src="bundle.js">`
- **DefinePlugin**: Replaces strings defined in .env like process.env.API_KEY to real value
- **CopyWebpackPlugin**: copy file .png into /dist/assets/dog.png from /public/assets/dog.png
- **CompressionPlugin**: compress /dist/bundle.js to /dist/bundle.js.gz 
- **HotModuleReplacementPlugin**: 
Wraps each module with HMR runtime code. 
Add if (module.hot) {module.hot.accept();} under each module
“Hey, I can be hot-replaced if this file changes.”

---

## 💻 Client-Side: What the Browser (Client) Does

### 1. **Loads the Page**

* Makes a request to `localhost:<port>/`
* Loads the bundle served by the dev server
* Runs your app using the bundled JS

### 2. **Connects to Dev Server via WebSocket**

* Uses HMR client injected by `webpack-dev-server`
* Listens for module updates

### 3. **Handles HMR Updates**

* When the server detects a change:

  * Recompiles just affected module
  * Sends  WebSocket
  * The client **replaces the module in memory** without reloading the page

---




Try to build a dashboard:

At the local side, it tested successfully, 
Express.js(framework) + Node.js(local Environment for running JS) = server (in the project folder)
GraphiQL(like REST service) 
MySQL(local)


Might edit place:
Package.json
"homepage": "https://jerry93169.github.io/ReactDashboard",
“script”


plan:
Try to connect my own supabase and import the data then i asked for the real supabase. 
Change my build into supabase version(right now it's mysql) 
Also try to remain the local side(also connect to supabase) through GraphiQL
Set the webpage on github or render(try to know the fauculty)


Local testing:

webpack-dev-server (WDS) 
1. Node.js-based HTTP server
2. Located in http://localhost:3000
3. 
4. run middleware(the running process after received request and before sending response) like serving file from memory, processing HMR logic,  
5. apply the file changing immediately to the React app. (Hot reloads), 
6. won't change the current status like scrolling (Hot Module Replacement (HMR))
use:

npm install --save-dev webpack-dev-server

"scripts": {
  "start": "webpack-dev-server --mode development"
}

example:

open webpage, client(browser) sent request to webpack server(http://localhost:3000)
webserver start running middleware: 
save the request to log, open React file from memory