class OrdersController < ApplicationController
  def index
    # JSで変数を使用する。gon.（変数名） = （代入する値）
    gon.public_key = ENV["PAYJP_PUBLIC_KEY"]
    # orderモデルのインスタンスを生成
    @order = Order.new
  end

  def create
  @order = Order.new(order_params)
  # バリデーションを実行→エラーの有無を判断
  if @order.valid?
    # true(エラーがない)場合の処理
    pay_item
    @order.save
    return redirect_to root_path
  else
    # render 'index'した際にJSを使用できるようにする
    gon.public_key = ENV["PAYJP_PUBLIC_KEY"]
    render 'index', status: :unprocessable_entity
  end
end

private
def order_params
  # priceの情報が、order_params[:token]としてtokenの情報を取得
  params.require(:order).permit(:price).merge(token: params[:token])
end

def pay_item
  # 秘密鍵を環境変数に設定するまでPUSH厳禁 *****************************************************************************************************************************
    Payjp.api_key = ENV["PAYJP_SECRET_KEY"]  # 自身のPAY.JPテスト秘密鍵を記述→環境変数に設定
    Payjp::Charge.create(
      amount: order_params[:price],  # 商品の値段（実際に決済する金額）
      card: order_params[:token],    # カードトークン（トークン化されたカード情報）
      currency: 'jpy'                 # 通貨の種類（日本円）
      )
  end
end


