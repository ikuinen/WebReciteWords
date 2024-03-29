import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
//import Avatar from '@material-ui/core/Avatar';
import Lock from '@material-ui/icons/Lock'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Email from '@material-ui/icons/Email';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    container:{

    },
    root: {
        maxWidth: 400,
        padding: 'auto',
        paddingTop: 10,
        marginTop: 120,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 3px 20px 2px rgba(135, 105, 255, .30)',
        //background: '#ECEFF1',
    },
    button: {
        background: 'linear-gradient(45deg, #00B8D4 30%, #64FFDA 90%)',
        borderRadius: 5,
        border: 0,
        color: 'white',
        height: 32,
        width: 260,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(135, 105, 255, .30)',
    },
    paper: theme.mixins.gutters({
        maxWidth: 356,
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        boxShadow: '0 3px 5px 2px rgba(135, 105, 255, .30)',
    }),
    progress: {
        margin: theme.spacing.unit * 8,
    },
});

class LoginCard extends React.Component {
    constructor(props) {
        super(props);
        //console.log('constructor:' + props);
        this.state = {
            account: '',  password: '',
            login: false,  register: false,
            registerAccount: '', registerPass1: '',
            registerPass2: '',  registerEmail: '', loading: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleClick() {
        const {account, password} = this.state;
        if(account.length >= 6 && password.length >= 6){
            let data = {'username': account, 'password': password};
            let self = this;
            fetch(localStorage.getItem('prefix') + '/token/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            }).then(function(response) {
                ///if(!response.ok)
                self.setState({loading: false});
                return response.json();
            }).then(function(response) {
                if(response['token'] === undefined)
                    throw new Error();
                localStorage.setItem('username', account);
                localStorage.setItem('token', response['token']);
                self.setState({login: true});
                console.log(response);
            }).catch(function (error) {
                self.setState({loading: false, errorOpen1: true, errorMsg1: '用户名无效或密码错误'});
            });
        }
        else
            this.setState({errorOpen1: true, errorMsg1: '请输入正确的用户名和密码'});
    }

    handleRegister() {
        const {registerAccount, registerPass1, registerPass2, registerEmail} = this.state;
        let yes = true;
        let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        if(registerAccount.length < 6){
            this.setState({registerAccountError: true, registerAccountInfo: '用户名长度不能小于6'});
            yes = false;
        }
        else
            this.setState({registerAccountError: false, registerAccountInfo: ''});
        if(registerEmail.length === 0){
            this.setState({registerEmailError: true, registerEmailInfo: '请输入Email'});
            yes = false;
        }
        else{
            if(!reg.test(registerEmail)){
                this.setState({registerEmailError: true, registerEmailInfo: '请输入正确的Email'});
                yes = false;
            }
            else
                this.setState({registerEmailError: false, registerEmailInfo: ''});
        }
        if(registerPass1.length < 6){
            this.setState({registerPass1Error: true, registerPass1Info: '请输入密码'});
            yes = false;
        }
        else
            this.setState({registerPass1Error: false, registerPass1Info: ''});
        if(registerPass2.length < 6){
            this.setState({registerPass2Error: true, registerPass2Info: '请确认密码'});
            yes = false;
        }
        else
            this.setState({registerPass2Error: false, registerPass2Info: ''});
        if(registerPass1 !== registerPass2){
            this.setState({registerPass2Error: true, registerPass2Info: '两次输入的密码不一致',
                registerPass1Error: true, registerPass1Info: '两次输入的密码不一致'});
            yes = false;
        }
        //console.log(yes);
        if(yes){
            let data = {
                'username': registerAccount,
                'password': registerPass1,
                'email': registerEmail,
            };
            let status = 200;
            let self = this;
            fetch(localStorage.getItem('prefix') + '/users/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            }).then(function(response) {
                status = response.status;
                return response.json();
            }).then(function(response) {
                if (status >= 200 && status < 300) {
                    self.setState({register: false});
                    self.setState({loading: true});
                    let data = {'username': registerAccount, 'password': registerPass1};
                    fetch(localStorage.getItem('prefix') + '/token/', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {'Content-Type': 'application/json'}
                    }).then(function(response) {
                        return response.json();
                    }).then(function(response) {
                        localStorage.setItem('token', response['token']);
                        localStorage.setItem('username', registerAccount);
                        self.setState({login: true});
                        console.log(response);
                    });
                }
                else{
                    if(response['username'] !== undefined)
                        self.setState({registerAccountError: true, registerAccountInfo: response['username']});
                    if(response['email'] !== undefined)
                        self.setState({registerEmailError: true, registerEmailInfo: response['email']});
                }
            });

        }
    }

    render() {
        const {classes} = this.props;
        const css = (
            <div>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/bay-components/v0.3.1/bay-components.min.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/iconbay/v0.1.19/iconbay.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/xbay/v1.11.5/client-ui.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/web/public/account-client-css-36cd83c3ecb6834f.css"/>
            </div>
        );
        const dialog = (
            <Dialog open={this.state.register} style={{paddingTop: 20}}
                                onClose={() => this.setState({register: false})}>
            <DialogTitle id="form-dialog-title">注册</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    注册新的用户
                </DialogContentText>
                <Grid container spacing={16} alignItems="flex-end">
                    <Grid item> <AccountCircle color="action"/> </Grid>
                    <Grid item>
                        <TextField required autoFocus margin="dense" id="register_account"
                            helperText={this.state.registerAccountInfo} error={this.state.registerAccountError}
                            label="Account" type="text" fullWidth
                                   onChange={(event) => this.setState({registerAccount: event.target.value})}/>
                    </Grid>
                </Grid>
                <Grid container spacing={16} alignItems="flex-end">
                    <Grid item> <Email color="action"/> </Grid>
                    <Grid item>
                        <TextField required autoFocus margin="dense" id="register_email"
                                   helperText={this.state.registerEmailInfo} error={this.state.registerEmailError}
                                   label="Email Address" type="email" fullWidth
                                   onChange={(event) => this.setState({registerEmail: event.target.value})}/>
                    </Grid>
                </Grid>
                <Grid container spacing={16} alignItems="flex-end">
                    <Grid item> <Lock color="action"/> </Grid>
                    <Grid item>
                        <TextField required autoFocus margin="dense" id="register_pass"
                            label="Password" type="password" fullWidth
                                   helperText={this.state.registerPass1Info} error={this.state.registerPass1Error}
                                   onChange={(event) => this.setState({registerPass1: event.target.value})}/>
                    </Grid>
                </Grid>
                <Grid container spacing={16} alignItems="flex-end">
                    <Grid item> <Lock color="action"/> </Grid>
                    <Grid item>
                        <TextField required autoFocus margin="dense" id="register_pass_confirm" label="Confirm Password"
                                   type="password" fullWidth
                                   helperText={this.state.registerPass2Info} error={this.state.registerPass2Error}
                                   onChange={(event) => this.setState({registerPass2: event.target.value})}/>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({register: false})} color="primary">
                    取消
                </Button>
                <Button onClick={this.handleRegister} color="primary">
                    注册
                </Button>
            </DialogActions>
        </Dialog>);
        const errorDialog1 = ( <Dialog
                open={this.state.errorOpen1}
                onClose={() => this.setState({errorOpen1: false})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"登陆失败"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.errorMsg1}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({errorOpen1: false})} color="primary" autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>);
        const login = Boolean(localStorage.getItem('token'));
        console.log(localStorage.getItem('token'));
        if(this.state.login || login)
            return <Redirect push to={'/'}/>;
        //style="transition: -webkit-transform 0.6s ease; transform: translate3d(-1350px, 0px, 0px);"
        return (
            <div style={{ paddingTop: 70 }} className={classes.container} >
                {css}
                {dialog}
                {errorDialog1}
                <div className="login-client-page">
                    <div className="slides" id="slides">
                        <div className="viewport" id="viewport">
                            <div className="page-view">
                                <div className="view-container">
                                    <img src="https://static.baydn.com/web/images/intro-client-checkin.png"/>
                                    <div className="title">坚持打卡</div>
                                    <div className="content">享受学习的快乐</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="login-wrap">
                        <Grid container direction={'column'} spacing={24}
                              alignItems={'center'} style={{marginTop:'128px'}}>
                            <Grid item>
                                <TextField style={{ fontSize: 36 }}
                                    label="Email/Account"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle color="action"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(event) => this.setState({account: event.target.value})}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Password"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action"/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(event) => this.setState({password: event.target.value})}
                                />
                            </Grid>
                            <Grid item>
                                <Button className={classes.button} onClick={this.handleClick}>
                                    登陆
                                </Button>
                            </Grid>
                            <Grid item>
                                <a className="register-text" href='#' onClick={() => this.setState({
                                    register: true,
                                    registerAccountError:false, registerAccountInfo:'',
                                    registerEmailError:false, registerEmailInfo:'',
                                    registerPass1Error:false, registerPass1Info:'',
                                    registerPass2Error:false, registerPass2Info:'',
                                })}>还没有账号？
                                    <span style={{color:'#2196F3'}}>去注册</span>
                                </a>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

LoginCard.protoTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginCard);