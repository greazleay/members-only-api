import Post from '@models/Post';
import { body } from 'express-validator';
import { Response, NextFunction, Request } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { formatPostCommentsAndLikes, handleValidationErrors, checkIfPostExists } from '@utils/lib';
import { Comment, Like } from '@utils/classes';
import { Types } from 'mongoose';
import { IPost } from '@interfaces/posts.interface';

export const get_get_all_posts = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({}).exec();
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

export const get_posts_by_user = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({ user: req.user._id }).exec();
        if (!posts.length) return res.status(404).json({ msg: 'No posts found' });
        res.status(200).json(posts);
    } catch (error) {
        next(error)
    }
}

export const get_get_post_by_id = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await checkIfPostExists(req, res, next);
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

export const post_create_post = [
    (req: Request, res: Response, next: NextFunction) => formatPostCommentsAndLikes(req, res, next),

    body('postContent').not().isEmpty().withMessage('Post content cannot be empty'),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {

        handleValidationErrors(req, res);

        try {
            const post = new Post({
                user: new Types.ObjectId(req.user._id),
                post_content: req.body.postContent
            });
            await post.save();
            res.status(201).json({
                message: 'Post created successfully',
                post
            });
        } catch (err) {
            if (err instanceof Error) {
                console.error(err);
                next(err);
            }
        }
    }
];

export const put_add_comments = [

    body('comment').not().isEmpty().withMessage('Comment cannot be empty'),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {

        handleValidationErrors(req, res);

        try {
            
            const post = await checkIfPostExists(req, res, next) as IPost;

            const userId = new Types.ObjectId(req.user._id);
            switch (true) {
                case !post.comments.length || !post.comments.find(comment => comment.comment_user.equals(userId)):
                    const comments = new Comment(userId, [{ comment: req.body.comment, comment_date: new Date(Date.now()) }]);
                    post.comments = [...post.comments, comments];
                    await post.save();
                    break;
                case post.comments.some(comment => comment.comment_user.equals(userId)):
                    const commentIndex: number = post.comments.findIndex(comment => comment.comment_user.equals(userId));
                    post.comments[commentIndex].comment_list = [...post.comments[commentIndex].comment_list, { comment: req.body.comment, comment_date: new Date(Date.now()) }];
                    await post.save();
                    break;
            };

            res.status(200).json({ message: 'Comment added successfully', post });

        } catch (error) {
            console.error(error);
            next(error);
        };
    }
];

export const delete_delete_comment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        
        const post = await checkIfPostExists(req, res, next) as IPost;

        const commentIndex: number = post.comments.findIndex(comment => comment.comment_user.equals(new Types.ObjectId(req.user._id)));
        if (commentIndex === -1) return res.status(404).json({ msg: 'User has not commented on this post' });
        
        const commentIndexInCommentList: number = post.comments[commentIndex].comment_list.findIndex(comment => comment._id!.equals(new Types.ObjectId(req.params.commentId)));
        if (commentIndexInCommentList === -1) return res.status(404).json({ msg: 'Comment not found' });

        post.comments[commentIndex].comment_list.splice(commentIndexInCommentList, 1);
        await post.save();
        
        res.status(200).json({ message: 'Comment deleted successfully', post });
    } catch (error) {
        next(error);
    };
};

export const put_like_post = async (req: RequestWithUser, res: Response, next: NextFunction) => {

    try {
        const post = await checkIfPostExists(req, res, next) as IPost;

        const userId = new Types.ObjectId(req.user._id);
        switch (true) {
            case !post.likes.length || !post.likes.some(like => like.like_user.equals(userId)):
                const newLike = new Like(userId, new Date(Date.now()));
                post.likes = [...post.likes, newLike];
                await post.save();
                break;
            case post.likes.some(like => like.like_user.equals(userId)):
                return res.status(403).json({ message: 'You have already liked this post' });
        }

        res.status(200).json({ message: 'Like added successfully', post });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const delete_unlike_post = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const post = await checkIfPostExists(req, res, next) as IPost;

        const likeIndex: number = post.likes.findIndex(like => like.like_user.equals(new Types.ObjectId(req.user._id)));
        if (likeIndex === -1) return res.status(404).json({ msg: 'User has not liked this post' });

        post.likes.splice(likeIndex, 1);
        await post.save();

        res.status(200).json({ message: 'Like deleted successfully', post });

    } catch (error) {
        next(error);
    }
}