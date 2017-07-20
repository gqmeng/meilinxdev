<template id='login_overlay'>
	<olnpane layerid=0>
		<div slot='ol-title'><h3>Log in</h3></div>
		<div slot='ol-form'>
		   <form @submit.prevent="validateLoginForm" data-vv-scope="loginform" autocomplete='on'>
			<fieldset class='fieldcontainer' id='first'>
			<div class='loginField'>
               <label class="label">Username</label>
                <p class="control has-icon has-icon-right">
                    <input spellcheck=false v-model='userModel.user.username' name="email" v-validate data-vv-delay="1000" data-vv-rules="required|email" :class="{'input': true, 'is-danger': errors.has('email', 'loginform') }" type="text" placeholder="Email">
                    <i v-show="errors.has('email', 'loginform')" class="fa fa-warning"></i>
                    <span v-show="errors.has('email', 'loginform')" class="help is-danger">{{ errors.first('email', 'loginform') }}</span>
                </p>
					    <!--<button class='edit_btn' >Need to create an account?</button>-->
				</div>
				<div class='loginField'>
				 <label class="label">Password</label>
                 <p class="control has-icon has-icon-right">
                     <input spellcheck=false  v-model='userModel.user.password' name="password" v-validate data-vv-delay="800" data-vv-rules="required|min:4" :class="{'input': true, 'is-danger': errors.has('password', 'form-1') }" type="password" placeholder="Password">
                     <i v-show="errors.has('password', 'loginform')" class="fa fa-warning"></i>
                     <span v-show="errors.has('password', 'loginform')" class="help is-danger">{{ errors.first('password', 'loginform') }}</span>
                 </p>
									    <!-- 											<button class='edit_btn' >Forgot your password?</button>
		 -->							</div>
								<div class='loginField'>



									<div class='ot-s-btn ot-login'>
								       <div class='greenbutton' > </div>
								       <div class='btnContent'><button class='login' type='submit'>LOG IN</button></div>
								</div>



									</div>
				</fieldset>
				</form>
		</div>
		<div slot='ol-processing'>Log in ...</div>
		<div slot='ol-success'>Login Successful !!!</div>
		<div slot='ol-failure'>Unable to login. Please check your username and password! </div>
		<div slot='ol-warning'>Warning !!!</div>
	</olnpane>
</template>
<script>
import olnpane from '../components/olnpane';
import eventBus from '../components/eventBus.js';
export default {
  name: 'login',
  data: function () {
    return {
      userModel: {user: {username: '', password: ''}},
      role: 'default',
      test: true
    };
  },
  components: {
    olnpane
  },
  methods: {
	  validateLoginForm(e) {
          this.$validator.validateAll('loginform');
          if (!this.errors.any('loginform')) {
	            this.userlogin()
	        }
      },
	  validateBeforeSubmit(e) {
	        this.$validator.validateAll();
	        if (!this.errors.any()) {
	            this.userlogin()
	        }
	      },
    userlogin: function () {
      var self = this;  // eslint-disable-line
      if (this.test) {
        $( 'div.processing' ).fadeIn( 300 );  // eslint-disable-line
        $.ajax({  // eslint-disable-line
          type: 'POST',
          url: 'login',
          data: self.userModel.user,
          dataType: 'json',
          success: function (response) {
            $( 'div.processing' ).fadeOut( 200 );  // eslint-disable-line
            $('div.success').fadeIn(300).delay(500).fadeOut(400, function(){  // eslint-disable-line
           	$.extend(true, self.userModel.user, response);
            eventBus.$emit('userloggedin', self.userModel.user);  // eslint-disable-line
            });
          },
          error: function (response) {
				$( 'div.processing' ).fadeOut( 200 );  // eslint-disable-line
				$( 'div.failure' ).fadeIn( 300 ).delay( 500 ).fadeOut( 400 ); // eslint-disable-line
          }
        });
      } else {
      }
    }
  }
};
</script>
<style scoped>
p.control {
	position: absolute;
	margin: 12px 0;
}
.loginField input[type=text], .loginField input[type=password] {
    width: 400px;
    height: 50px;
}
.loginField label {
	position: relative;
	color: #666666;
	font-weight: 400;
	font-size: 16px;
line-height: 1.6em;
padding: 10px 14px;
margin:0px;
}
p.control span.is-danger {
	position: absolute;
	left: 16px;
	top: 62px;
font-style: italic;
font-size: 12px;
color: #ec2526;


}
.fieldcontainer {
    display: block;
    position: relative;
    height: 95%;
    overflow: auto;
margin: 0 auto;
padding: 0px 20px;
}

.ot-s-btn .btnContent{
	  position: relative;
	  top:-86px;
	  left:0px;
	}
.ot-login {
	padding: 22px 0px;
}
button.login {
    width: 400px;
    position: relative;
    height: 50px;
    border-radius: 10px;
    border:none;
    background-color: transparent;
    color: #fff;
    margin-top: 38px;
}
.entryform {
    height: 600px;
    padding: 16px 22px;
    margin-top: 0px;
}
.loginField {
    margin: 25px 0px 25px 0px;
    height: 120px;
}
fieldset h4 {
    display: inline-block;
    padding: 5px 16px;
    font-size: 14px;
    font-weight: 400;
    margin-right: 20px;
    color: #666666;
}
.addtext {
    position: relative;
    width: 100%;
    padding: 0;
    margin: 5px 0px 15px 0px;
    color: #666666;
}

h3 {
    font-size: 24px;
    font-weight: 300;
}
input[type=text], input[type=password], input[type=textarea], .addtext a {
    width: 350px;
    height: 53px;
    padding: 0px 16px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    margin: 2px 0;
    font-size: 14px;
    color: #666666;
    font-weight: 400;
}
</style>
