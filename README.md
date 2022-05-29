# use fincodeAPI

fincodeAPIを使った支払いフロー、fincodeJSのUI機能を使ったカード情報入力フォームの作成をしています。
fincodeJSで使用できるAPIに関してはフロントエンドで叩き、それ以外のAPIはバックエンドのnodeで叩いている。
.envにシークレットキーを置いて読み込んでいるので各自作成する必要あり。

## 試したAPI

- 決済登録(node)
- 顧客登録(node)
- 決済実行(javaScript)
- カード登録(javaScript)


## Running the sample

1. Build the server

~~~
npm install
~~~

2. Run the server

~~~
npm start
~~~

3. Go to [http://localhost:4242/card.html?amount=1200&name=customer01](http://localhost:4242/card.html?amount=1200&name=customer01)
