import passport from 'passport'

export default function (app: any) {

    app.get('/auth/github/callback', passport.authenticate('github', { failWithError: true }), (_req: any, res: any) => res.redirect('/'))
    //app.get('/login', (req: any, res: any) => res.render('login', { user: req.user }))
    app.get('/logout', (req: any, res: any) => {
        req.logout();
        res.redirect('/')
    })
    app.get('/me', (req: any, res: any) => res.json({ username: req.user?.username, avatar_url: req.user?._json.avatar_url }))
    app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }), (req: any, res: any) => { })
}