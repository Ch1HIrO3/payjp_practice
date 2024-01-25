// ページが読み込まれた時に、payという変数に代入したアロー関数が実行される

const pay = () => {
  const publicKey = gon.public_key
  
  // （PAYJPアカウントから公開鍵を取得）Payjpインスタンスを生成する
  const payjp = Payjp(publicKey) // PAY.JPテスト公開鍵（環境変数に設定→gon）
  // elementsインスタンスを作成
  const elements = payjp.elements();

  // 入力フォームを作成。elements.create('指定したいフォームのtype')
  const numberElement = elements.create('cardNumber');
  const expiryElement = elements.create('cardExpiry');
  const cvcElement = elements.create('cardCvc');

  // id属性の要素とフォームを置き換える
  numberElement.mount('#number-form');
  expiryElement.mount('#expiry-form');
  cvcElement.mount('#cvc-form');
  // フォームの送信ボタンをクリックしたら、イベントが発火
  const form = document.getElementById('charge-form')
  form.addEventListener("submit", (e) => {

    // payjp.createToken(入力フォームelementインスタンス).then
    payjp.createToken(numberElement).then(function (response) {
      // レスポンスを受け取った後の処理
      if (response.error) {
      } else {
        // トークンの値を取得=>定数に定義
        const token = response.id;
        
        // input要素を生成しフォームに加え、その値としてトークンをセット
        const renderDom = document.getElementById("charge-form");
        // HTMLのinput要素にトークンの値を埋め込み、フォームに追加
        // value:実際に送られる値、name:その値を示すプロパティ名、type="hidden":ブラウザにトークンを表示しない
        const tokenObj = `<input value=${token} name='token' type="hidden">`;
        // insertAdjacentHTMLメソッドでフォームの中に作成したinput要素を追加
        renderDom.insertAdjacentHTML("beforeend", tokenObj);
      }
      // クレジットカードの情報を削除
      numberElement.clear();
      expiryElement.clear();
      cvcElement.clear();
      // フォームの情報をサーバーサイドに送信
      document.getElementById("charge-form").submit();
    });
    // 通常のRuby on Railsにおけるフォーム送信処理はキャンセル
    e.preventDefault();
  });
};

window.addEventListener("turbo:load", pay);
window.addEventListener("turbo:render", pay);