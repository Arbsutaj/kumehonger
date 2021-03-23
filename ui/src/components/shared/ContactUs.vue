<template>
  <div>
    <Header></Header>
    <section class="contact-form section-padding3">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 mb-5 mb-lg-0">
            <div class="d-flex">
              <div class="into-icon">
                <box-icon name='home' type='solid' color="#ffb606"></box-icon>
              </div>
              <div class="info-text">
                <h5>Kosovo, Prishtine</h5>
                <p>Bregu diellit</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="into-icon">
                <box-icon name='phone' type='solid' color="#ffb606"></box-icon>
              </div>
              <div class="info-text">
                <h5>383 (49) 875 446</h5>
                <p>Mon to Fri 9am to 6 pm</p>
              </div>
            </div>
            <div class="d-flex">
              <div class="into-icon">
                <box-icon type='regular' name='envelope' color="#ffb606"></box-icon>
              </div>
              <div class="info-text">
                <h5>sutajarb@gmail.com</h5>
                <p>Send us your query anytime!</p>
              </div>
            </div>
          </div>
          <div class="col-lg-9">
            <form action="#">
              <div class="left">
                <input type="text" placeholder="Enter your name" onfocus="this.placeholder = ''"
                       onblur="this.placeholder = 'Enter your name'" required v-model="contactUs.name">
                <input type="email" placeholder="Enter email address" onfocus="this.placeholder = ''"
                       onblur="this.placeholder = 'Enter email address'" required v-model="contactUs.email">
                <input type="text" placeholder="Enter subject" onfocus="this.placeholder = ''"
                       onblur="this.placeholder = 'Enter subject'" required v-model="contactUs.subject">
              </div>
              <div class="right">
                <textarea name="message" cols="20" rows="7" placeholder="Enter Message" onfocus="this.placeholder = ''"
                          onblur="this.placeholder = 'Enter Message'" required v-model="contactUs.message"></textarea>
              </div>
              <button class="template-btn" v-on:click="sendMessage()">send message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import {ContactUsRequest} from "@/components/shared/transport/contact.us.request";

export default {
  name: "ContactUs",
  components: {Footer, Header},
  data:() => ({
    contactUs: new ContactUsRequest()
  }),
  methods: {
    sendMessage: async function() {
      await this.axios.post(`contact-us/`, this.contactUs).then((resp) => {
        this.contactUs = resp.data;
      });
    }
  }
}
</script>

<style scoped>

.into-icon i {
  font-size: 20px;
  color: #ffb606;
}

.template-btn {
  color: #131230;
  background: #ffb606;
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  display: inline-block;
  padding: 12px 30px !important;
  -webkit-transition: all .5s;
  -moz-transition: all .5s;
  -o-transition: all .5s;
  transition: all 0.5s
}

.template-btn:hover {
  color: #131230;
  background: transparent;
  border: 1px solid #ffb606
}

.section-padding3 {
  padding-bottom: 130px;
  padding-top: 130px;
}

.info-text h5 {
  color: #131230;
  font-family: "Playfair Display", serif;
  text-transform: capitalize;
  font-size: 20px !important;
  font-weight: 700;
  margin-left: 20px;
}


.contact-form form .left, .commentform-area form .left {
  width: 48%;
  float: left;
  overflow: hidden;
  margin-right: 4%
}

@media (max-width: 575.98px) {
  .contact-form form .left, .commentform-area form .left {
    width: 100%;
    float: none
  }
}

.contact-form form .left input, .commentform-area form .left input {
  width: 100%;
  border: 1px solid #eee;
  padding: 12px 20px;
  margin-bottom: 20px
}

.contact-form form .right, .commentform-area form .right {
  width: 48%;
  overflow: hidden
}

@media (max-width: 575.98px) {
  .contact-form form .right, .commentform-area form .right {
    width: 100%;
    float: none
  }
}

.contact-form form .right textarea, .commentform-area form .right textarea {
  width: 100%;
  border: 1px solid #eee;
  padding: 12px 20px
}

.contact-form form button, .commentform-area form button {
  margin-top: 20px;
  float: right
}

@media (max-width: 575.98px) {
  .contact-form form button, .commentform-area form button {
    float: left
  }
}
</style>