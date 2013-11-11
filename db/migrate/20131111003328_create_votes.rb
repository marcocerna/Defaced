class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.boolean :upvote
      t.integer :pothole_id
      t.integer :user_id

      t.timestamps
    end
  end
end
