'use strict';

module.exports = (app, db) => {
  app.get('/users', (req, res) => {
    db.users.findAll({
      attributes: ['id', 'username', 'role'],
      include: [
        {
          model: db.posts,
          attributes: [['id', 'postId'],'user_id','content'],
          include: [
            {
              model: db.comments,
              attributes: { exclude: ['post_id', 'created_at', 'updated_at', 'deleted_at']}
            }
          ]
        }
      ]
    })
    // db.sequelize.query("SELECT `user`.`id`, `user`.`username`, `user`.`role`, `user`.`created_at`, \
    // `user`.`updated_at`, `user`.`deleted_at`, `posts`.`id` AS `posts.id`, \
    // `posts`.`id` AS `posts.postId`, `posts`.`user_id` AS `posts.user_id`, \
    // `posts`.`content` AS `posts.content`, `posts.comments`.`id` AS `posts.comments.id`, \
    // `posts.comments`.`content` AS `posts.comments.content`, `posts.comments`.`commenter_username` \
    //  AS `posts.comments.commenter_username`, `posts.comments`.`commenter_email` \
    //  AS `posts.comments.commenter_email`, `posts.comments`.`status` AS `posts.comments.status` FROM `users` AS `user` left outer join `posts` AS `posts` ON `user`.`id` = `posts`.`user_id` LEFT OUTER JOIN `comments` AS `posts.comments` ON `posts`.`id` = `posts.comments`.`post_id`")
    // db.sequelize.query('Select users.*, posts.*, comments.* from users left join posts on posts.user_id = users.id left join comments on comments.post_id = posts.id')
    .then(function(users){
      res.json(users)
    });
  });

  app.post('/users', (req, res) => {
    const created_at = new Date();
    const newUser = req.body.user;
    db.users.create({
      username: newUser.username,
      role: newUser.role,
      created_at: created_at
    })
    .then(user => {
      res.json(user);
    });
  });

  app.post('/post', (req, res) => {
    const created_at = new Date();
    const newPost = req.body.post;
    db.posts.create({
      user_id: newPost.user_id,
      content: newPost.content,
      created_at: created_at
    })
    .then(post => {
      res.json(post);
    });
  });

  app.post('/comment', (req, res) => {
    const created_at = new Date();
    const newComment = req.body.comment;
    db.comments.create({
      post_id: newComment.post_id,
      content: newComment.content,
      commenter_username: newComment.commenter_username,
      commenter_email: newComment.commenter_email,  
      created_at: created_at
    })
      .then(comment => {
        res.json(comment);
      });
  });

};