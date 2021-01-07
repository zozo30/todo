import passport from 'passport'

export default function (app: any) {

    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (_req: any, res: any) => {
        res.redirect('/')
    })

    app.get('/login', (req: any, res: any) => {
        res.render('login', { user: req.user })
    })

    app.get('/logout', (req: any, res: any) => {
        req.logout();
        res.redirect('/')
    })

    app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }), (req: any, res: any) => { })
}