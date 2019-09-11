# frozen_string_literal: true

# User model
class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  has_secure_password

  has_many :project_users
  has_many :projects, through: :project_users

  def to_json(options = {})
    options[:except] ||= %i[password_digest created_at updated_at]
    super(options)
  end
end
