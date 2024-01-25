class Order < ApplicationRecord
  # tokenについてもOrderモデルで取り扱えるように→tokenのバリデーションが設定可能になる
  attr_accessor :token
  validates :price, presence: true
  # tokenが空では保存できない
  validates :token, presence: true
end
