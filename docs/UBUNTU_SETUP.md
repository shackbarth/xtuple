Setting up an Ubuntu virtual machine
====================================

These are instructions for creating a baseline 64 bit Ubuntu machine with software loaded that is helpful for doing xTuple mobile-web development work directly on the machine. It assumes you are starting with no experience with Linux or github. If you plan on using the Ubuntu desktop to do file editing and other work, it is recommended you allocate at least 2GB of RAM (the more the better). If you only plan on using it as a server, you can get away with as little as 1GB.

##Download and install VirtualBox.

If you already run Linux on your workstation, your distribution may have VirtualBox packages which you can install with your package manager. Otherwise you can get and install VirtualBox as follows:

 - Go to www.virtualbox.org
 - Click Downloads
 - Click on the link for the VirtualBox platform package for your workstation environment
 - Install VirtualBox from the downloaded file as app

##Download Ubuntu:

 - Go to www.ubuntu.com/download
 - Click on Ubuntu Desktop
 - For "Choose your flavour", select 64 bit
 - Click on Get Ubuntu 12.04 LTS
 - If the website asks for a donation, decide whether to contribute or not now, take me to the download
 - Remember where the download process puts the Ubuntu .iso file

##Install Ubuntu

 Start VirtualBox to create the new VM. You'll need to mount the Ubuntu .iso file as the boot device when the VM first starts up. Along the way, VirtualBox will ask you to set some basic parameters for the VM. Make sure to allocate enough disk space, as this is harder to adjust later than some of the other features of the VM. Take the following steps after VirtualBox starts:

 - Click the New button in the toolbar
 - Go through the Create Virtual Machine wizard and use the following settings:
  * Name: Pick a name that will help you distinguish this VM from others like it
  * Type: Linux
  * Version: Ubuntu 64 bit
  * Memory: 2064 MB (if your workstation can't spare that much, better consider buying more memory)
 - Create a virtual hard drive
  * Select the VDI file type and make it Dynamically allocated
  * File location and size
  * Leave the default file location but expand the file virtual hard drive to about 20GB
 - Select the new VM from the main VirtualBox Manager window and click the Start button in the toolbar
 - VirtualBox will ask you to select a start-up disk. Click the folder-shaped browse icon and select the Ubuntu .iso file you just downloaded, then click the Start button. This will boot the new VM using the .iso file as the boot disk.
 - Click Install Ubuntu
 - If the installer asks, select "Erase disk and install Ubuntu", and Continue. The next window should show you the size of the virtual hard disk. If this isn't the ~20 GB set above, Quit and check your VM again. Otherwise Install Now.
 - Answer whatever questions the Ubuntu installer asks. Since this isn't expected to be a secure production environment and the VM is intended to be shared, set the username/password pair to xtuple/xtuple and select "Log in automatically". Individual developers can change the password later if necessary.
 - When the installer asks you to reboot, do so. The rebooting process may ask you to eject the disk from the CD/DVD drive. Hover over the circular disk icon near the lower-right-hand edge of the VM window. If it reports the drive as Empty, just click on the window and hit the Enter key. If the drive is not empty, right click on the icon, eject the .iso file from the virtual drive, then click in the window and hit the Enter key.
 - After the VM reboots let the Update Manager upgrade the software that's installed and reboot again if necessary

##Get xTuple code base

You'll want to set up quick access to the terminal. Click on the Dash Home icon in the upper left. Search for "Terminal" and drag the terminal icon to the left launch bar. Click it to open the terminal.

Now install git from the terminal:

    sudo apt-get install git

The xTuple mobile web client files are maintained on github.com. You will need an account there to execute the following steps:

  * Log in to github.com
  * Navigate to the xTuple project: https://github.com/xtuple/
  * Fork the client repository:
    * Click on client
    * Click on Fork in the upper right-hand corner of the browser window
    * Click the Fork to your-username button

Create an SSH keypair so GitHub can authenticate your push requests:

    xtuple$ ssh-keygen # this isn't extremely secure but it'll do
    xtuple$ cat ~/.ssh/id_rsa.pub
    ssh-rsa AAA[...about 200 more characters]...M8n8/B xtuple@mobiledevvm

The cat command shows the public key that was just generated. Copy this text, starting with the ssh-rsa at the beginning and ending with the xtuple@mobiledevvm at the end (select and either right-click > Copy or Control-Shift-C in the Linux Terminal window).

In your web browser, navigate to your home page on GitHub. Click on Edit Your Profile. Select SSH Keys from the list on the left. Click Add SSH Key. Give this SSH key a title, such as "xTuple Mobile Dev VM", then paste the public key into the Key field. Finally click the Add key button. GitHub will verify your password just to make sure it's you at the keyboard.

Now clone the code from your fork into a local directory:

    mkdir src
    cd src
    git clone git@github.com:{yourusername}/xtuple.git

You can now run the install script as described on the main project [README](https://github.com/xtuple/xtuple/blob/master/README.md).

#Optimizing your virtual machine

Below are _optional_ instructions to optimize the VM for actually doing development. Yes, we could have made a VM that has all this for you, but this is much more fun. Plus you can pick and choose what you want and you'll know what you have when you're done.

##Update Ubuntu

These steps may be especially helpful if you want full screen mode to work correctly on your hardware.

From the terminal:

	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get install dkms

From the VirtualBox menu system, select Devices > Install Guest Additions. Inside the Ubuntu VM, click Run in the dialog box that appears. When the process is done, eject the VirtualBox Additions disk image and reboot the machine.

##User Settings

Right-click on the gear icon in the upper right corner of the Linux desktop > System Settings > Brightness and Lock. Turn off Lock, turn off the screen saver, and turn off requiring your password when waking from suspend.

##PG Admin

This is a useful graphical interface for interacting with the Postgresql database

	sudo apt-get install pgadmin3

From Dash Home, drag the pgAdmin icon to your launch bar.

##Chrome

Chrome is our preferred web browser because it has excellent built-in debugging tools. If you look in the Ubuntu Software Center you'll find Chromium which is similar, but noticably inferior to Chrome. We suggest sticking with Chrome. You have to actually download it manually, however:

https://www.google.com/intl/en/chrome

Follow the website instructions for downloading and installing Chrome. From Dash Home search for and drag the Chrome icon to your launch bar.

##Sublime with JSHint installed

This is a nice text editor for coding. It's free, but also badgerware that will prompt you to pay a nominal purchase fee that is worthwhile for the feature set it offers. What is most important here is installing the [JSHint](http://www.jshint.com/about/) add-on package which is an enormous help for debugging JavaScript and conforming to xTuple style guidelines. You can get JSHint for a number of other popular editors as well including VIM for those of you who are command line junkies. Follow these instructions to get Sublime set up with a shortcut on the desktop and JS Hint installed.

Go to the [Sublime website](http://www.sublimetext.com/) and download the application. From the terminal where Sublime is downloaded we'll extract the file and get it setup to launch from the command line:

    cd home/xtuple/Downloads
    tar xf Sublime\ Text\ 2.0.1\ x64.tar.bz2
    sudo mv Sublime\ Text\ 2 /opt/
    sudo ln -s /opt/Sublime\ Text\ 2/sublime_text /usr/bin/sublime

You'll probably also want to be able to launch it from the desktop. The following command will launch sublime with a new desktop configuration file:

    sudo sublime /usr/share/applications/sublime.desktop

This will start sublime with a new desktop configuration file. Paste the contents below in the file and save.

    [Desktop Entry]
    Version=1.0
    Name=Sublime Text 2
    # Only KDE 4 seems to use GenericName, so we reuse the KDE strings.
    # From Ubuntu's language-pack-kde-XX-base packages, version 9.04-20090413.
    GenericName=Text Editor

    Exec=sublime
    Terminal=false
    Icon=/opt/Sublime Text 2/Icon/48x48/sublime_text.png
    Type=Application
    Categories=TextEditor;IDE;Development
    X-Ayatana-Desktop-Shortcuts=NewWindow

    [NewWindow Shortcut Group]
    Name=New Window
    Exec=sublime -n
    TargetEnvironment=Unity

Right click on the Sublime icon in the launcher and select "Lock to Launcher."

If you want to make Sublime the default editor for your files:

    sudo sublime /usr/share/applications/defaults.list

Find and replace all occurences of *gedit.desktop* with *sublime.desktop*.

Finally, change your indentation preferences to conform to xTuple style guidelines. On the bottom footer bar of the screen where it says `Spaces: 4` click and select `Indent Using Spaces` and `Tab width 2`.

###Install JSHint on Sublime

First you need to install package manager on Sublime:

  * Click the Preferences > Browse Packages… menu entry
  * Browse up a folder and then into the Installed Packages folder
  * Download Package [Control.sublime-package](https://sublime.wbond.net/Package%20Control.sublime-package) and copy it into the Installed Packages directory
  * Restart Sublime Text

Next, install the JSHint for node from the Terminal:

    npm install -g jshint

Install the package from Sublime:

  * `control`-`shift`-`p`
  * type `install p`, select `Package Control: Install Package`
  * type `jshint`, select `JSHint`

###Other Helpful Sublime Packages

* AllAutocomplete - Allows autocompletion across all open files. Default Sublime autocomplete is only within the current file

* TrailingSpaces - Strips annoying trailing whitespace from files

* Git - Git blame/branch/diff support

Follow the same steps as installing the JSHint package:

  * `control`-`shift`-`p`
  * type `install p`, select `Package Control: Install Package`
  * type the name of the package and select from the list

## Qt Client

If you are interested in building xTuple's [Qt](http://qt-project.org) C++ based desktop client you'll need to install the Qt development tools:

    sudo apt-get install libxtst-dev qt4-qmake libqt4-sql-psql libqt4-sql-odbc

Fork the xTuple repository [qt-client](https://github.com/xtuple/qt-client). Next clone and build the application:

    cd /home/xtuple/src
    git clone git@github.com:{yourname}/qt-client
    cd qt-client
    git submodule update --init
    cd openrpt
    qmake
    make
    cd ..
    qmake
    make

Now you can run the Qt client.

    ./bin/xtuple

