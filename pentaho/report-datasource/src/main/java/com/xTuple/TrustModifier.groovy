package com.xTuple

import java.net.*;
import groovy.json.*;
import javax.net.ssl.*;
import java.security.*;
import java.security.cert.*

class TrustModifier {
   static TrustingHostnameVerifier TRUSTING_HOSTNAME_VERIFIER = new TrustingHostnameVerifier();
   static SSLSocketFactory factory;

   static void relaxHostChecking(HttpURLConnection conn)
       throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException {

      if (conn instanceof HttpsURLConnection) {
         HttpsURLConnection httpsConnection = (HttpsURLConnection) conn;
         SSLSocketFactory factory = prepFactory(httpsConnection);
         httpsConnection.setSSLSocketFactory(factory);
         httpsConnection.setHostnameVerifier(TRUSTING_HOSTNAME_VERIFIER);
      }
   }

   static synchronized SSLSocketFactory prepFactory(HttpsURLConnection httpsConnection)
            throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {

      if (factory == null) {
         SSLContext ctx = SSLContext.getInstance("TLS");
         ctx.init(null, [ new AlwaysTrustManager() ] as TrustManager[] , null);
         factory = ctx.getSocketFactory();
      }
      return factory;
   }

   static class TrustingHostnameVerifier implements HostnameVerifier {
      boolean verify(String hostname, SSLSession session) {
         return true;
      }
   }

   static class AlwaysTrustManager implements X509TrustManager {
      void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException { }
      void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException { }
      X509Certificate[] getAcceptedIssuers() { return null; }
   }
 
}
