OAuth 2.0 Admin Interface
=========================

xTuple ERP Mobile-Web Client OAuth 2.0 Admin Interface Extension

This extension allows you to add and manage OAuth 2.0 clients in the xTuple ERP
Mobile-Web Client. Before you can use OAuth 2.0 to authenticate with you xTuple
OAuth 2.0 Server, you have to have valid OAuth 2.0 Client credentials
registered with that server. This extension provides a GUI interface for you to
add that OAuth 2.0 Client to the OAuth 2.0 Server.

xTuple's OAuth 2.0 Server is modeled off of Google's OAuth 2.0 Server. xTuple
currently supports two OAuth 2.0 scenarios:

  * [Web Server](https://developers.google.com/accounts/docs/OAuth2WebServer)
  * [Service Accounts](https://developers.google.com/accounts/docs/OAuth2ServiceAccount)

Those two types of clients can be added to your xTuple OAuth 2.0 Server in a
process very similar adding OAuth 2.0 Clients in Google's [APIs Console](https://code.google.com/apis/console#access).

Refer to xTuple wiki for more details on how to use [xTuple's OAuth 2.0 Server](https://github.com/xtuple/xtuple/wiki/xTuple%27s-OAuth-2.0-Server).

### OAuth 2.0 Extension Installation:

To use this extension, you need to first ensure that you have OpenSSL installed
on your OS that is running the server. If you are using Ubuntu, OpenSSL can be
installed with this command:

    sudo apt-get install openssl

### OAuth 2.0 Client Setup:

After you have installed the OAuth 2.0 extension, refresh your broswer and/or
restart the datasource. Then login to the Mobile-Web client as a privileged
"admin" user. Enter the "Setup->User Accounts" workspace and select your
"admin" user. Check the "oauth2" box in the "EXTENSIONS" section. Refresh your
browser again for the new privileges to show up. Then check the
"Maintain OAUTH2 Clients" in the "OAUTH2" Privileges section. It should look
similar to this:

![oauth2 extension setup](http://i.imgur.com/61ksWNW.png)

Then refresh your browser window and you should see an "OAUTH2" menu option on
the left hand side of the main home screen.

![oauth2 extension menu](http://i.imgur.com/ZuoRxYF.png)

Select the "OAUTH2" workspace and add an OAuth 2.0 Client. It should look
similar to this:

![oauth2 extension workspace](http://i.imgur.com/QE4SUHp.png)

You should then have all the OAuth 2.0 Client credentials you will need to
connect to the OAuth 2.0 Server.

Note, you do not have to add OAuth 2.0 Clients as the "admin" user, but you
will have to give a user "Maintain OAUTH2 Clients" privileges so they can
register their own clients. You should reserve that privilege for trusted
users only as it does open up your system to outside access.
