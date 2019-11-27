import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PrivacyPolicy extends Component {
  render() {
    return(
      <div>
        <h1 className='title is-1' id='top'>Privacy Policy</h1>
        <div className='_section'>
          <p>Urban Applause is an Open Source app. This SERVICE is provided by at no cost and is intended for use as is.</p>

          <p>This page is used to inform visitors of my policies regarding the collection, use, and disclosure of Personal Information, for those who decide to use my Service.</p>

          <p>If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy.</p>

          <p>The terms used in this Privacy Policy have the same meanings as in our <Link to='/terms-of-service'>Terms of Service</Link> on the Urban Applause website, unless otherwise defined in this Privacy Policy.</p>

          <h3 className='title is-3'>Information Collection and Use</h3>
          <p><b>iOS App:</b> Beyond the information Apple provides to developers that you can decide to provide, Urban Applause also uses Firebase Services within the app (Firebase's Privacy Policy can be found <a href='https://firebase.google.com/support/privacy' target='_blank'>here</a>, note that Urban Applause only uses a small subset of Firebase's many services). This helps to identify crashes and stability issues (Crashlytics, Performance Monitoring) and why they're caused (eg: a post that is crashing a lot of devices), which greatly speeds up and eases the ability to swiftly fix them. Firebase Analytics is also used within the app in order to better understand which features are being used in order to make development decisions and choose where to focus development effort. The information collected is anonymous. Urban Applause does not sell or rent your data, and the anonymous information is only collected to help make the app better.</p>
        </div>
        <div className='_section'>
          <h3 className='title is-3'>Cookies</h3>

          <p>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</p>

          <p>This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</p>
        </div>
        <div className='_section'>
          <h3 className='title is-3'>Service Providers</h3>

          <p>I may employ third-party companies and individuals due to the following reasons:</p>

            <p>To facilitate our Service; To provide the Service on our behalf; To perform Service-related services; or To assist us in analyzing how our Service is used. I want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p>
          </div>
          <div className='_section'>
            <h3 className='title is-3'>Security</h3>

            <p>I value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.</p>

          </div>
          <div className='_section'>
            <h3 className='title is-3'>Links to Other Sites</h3>

          <p>This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

          </div>
          <div className='_section'>
          <h3 className='title is-3'>Children’s Privacy</h3>

          <p>These Services do not address anyone under the age of 13. I do not knowingly collect personally identifiable information from children under 13. In the case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please <Link to='/support'>contact me</Link> so that I remove this content.</p>

          </div>
          <div className='_section'>
          <h3 className='title is-3'>Changes to This Privacy Policy</h3>

          <p>I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.</p>

          </div>
          <div className='_section'>
          <h3 className='title is-3'>Contact Us</h3>

          <p>If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at flannery.jefferson@gmail.com.</p>
        </div>

          <a href='#top'>Back to top<span className='icon is-medium'><i className='fa fa-arrow-up'/></span></a>
      </div>
    )
  }
}

export default PrivacyPolicy;
