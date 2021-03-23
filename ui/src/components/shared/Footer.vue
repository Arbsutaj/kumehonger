<template>
  <footer class="footer-area">
    <div class="footer-widget section-padding">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div class="single-widget single-widget1">
              <h2>Ku me <span class="style-change">honger?</span></h2>
              <p class="mt-3">This is a page where you can find best restaurants of Kosovo and their location
              create a restaurant, add menu of it, also add daily menu :) </p>
            </div>
          </div>
          <div class="col-md-6 align-self-center">
            <div class="single-widget single-widget2 my-5 my-md-0">
              <h5 class="mb-4">contact us</h5>
              <div class="d-flex">
                <div class="into-icon">
                  <i class="fa fa-map-marker"></i>
                </div>
                <div class="info-text">
                  <p>Kosovo, Prishtine Bregu i Diellit, Str. Qamil Bala, Entr.15, No. 9</p>
                </div>
              </div>
              <div class="d-flex">
                <div class="into-icon">
                  <i class="fa fa-phone"></i>
                </div>
                <div class="info-text">
                  <p>(383) 49 - 875 - 446</p>
                </div>
              </div>
              <div class="d-flex">
                <div class="into-icon">
                  <i class="fa fa-envelope-o"></i>
                </div>
                <div class="info-text">
                  <p>sutajarb@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        <div class="row">
          <div class="col-lg-7 col-md-6">
            <span></span>
          </div>
          <div class="col-lg-5 col-md-6">
            <div class="social-icons">
              <ul>
                <li class="no-margin">Follow Us</li>
                <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                <li><a href="#"><i class="fa fa-pinterest"></i></a></li>
                <li><a href="#"><i class="fa fa-instagram"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>

h2 {
  font-family: "Playfair Display", sans-serif;
  font-style: italic;
  color: #fff;
}

.style-change {
  color: #ffb606;
}
.footer-area .footer {
  background: #131230
}

.footer-area.footer h5, .footer-area.footer p {
  color: #fff
}

.footer-area.footer .footer-copyright span {
  color: #fff
}

.footer-widget {
  background: #131230
}

.footer-widget .single-widget1 {
  padding-right: 30px
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .footer-widget .single-widget1 {
    padding-right: 0
  }
}

.footer-widget .single-widget h5 {
  color: #ffb606;
  font-family: "Playfair Display", sans-serif;
  font-style: italic;
}

.footer-widget .single-widget i {
  color: inherit
}

.footer-widget2 .single-widget h5 {
  color: #131230;
}

.footer-copyright {
  padding: 30px 0;
  background: #0d0d27;
  color: #fff
}

.footer-copyright .color {
  color: #ffb606
}

.footer-copyright ul {
  float: right
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .footer-copyright ul {
    float: left;
    margin-top: 30px
  }
}

@media (max-width: 575.98px) {
  .footer-copyright ul {
    float: left;
    margin-top: 20px
  }
}

.footer-copyright ul li {
  display: inline;
  margin-left: 25px
}

.footer-copyright ul li i {
  display: inline-block;
  color: #fff;
  -webkit-transition: .3s;
  -moz-transition: .3s;
  -o-transition: .3s;
  transition: .3s
}

.footer-copyright ul li i:hover {
  color: #ffb606
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .footer-copyright ul .no-margin {
    margin-left: 0
  }
}

@media (max-width: 575.98px) {
  .footer-copyright ul .no-margin {
    margin-left: 0
  }
}

.section-padding {
  padding: 40px 0
}

.into-icon i {
  font-size: 20px;
  color: #ffb606;
  margin-right: 20px
}

</style>