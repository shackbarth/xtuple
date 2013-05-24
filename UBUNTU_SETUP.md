Setting up an Ubuntu virtual machine
====================================

These are instructions for creating a baseline Ubuntu machine that has the software loaded that is helpful for doing development work. 

###Creating a Baseline Virtual Machine

##Download and install VirtualBox.

If you already run Linux on your workstation, your distribution may have VirtualBox packages which you can install with your package manager. Otherwise you can get and install VirtualBox as follows:

 - Go to www.virtualbox.org
 - Click Downloads
 - Click on the link for the VirtualBox platform package for your workstation environment
 - Install VirtualBox from the downloaded file as app

##Download Ubuntu:

 - Go to www.ubuntu.com/download
 - Click on Ubuntu Desktop
 - For "Choose your flavour", select 64 bit unless your workstation has a 32 bit CPU
 - Click on Get Ubuntu 12.04 LTS
 - If the website asks for a donation, decide whether to contribute or not now, take me to the download
 - Remember where the download process puts the Ubuntu .iso file

##Installl Ubuntu

 Start VirtualBox to create the new VM. You'll need to mount the Ubuntu .iso file as the boot device when the VM first starts up. Along the way, VirtualBox will ask you to set some basic parameters for the VM. Make sure to allocate enough disk space, as this is harder to adjust later than some of the other features of the VM. Take the following steps after VirtualBox starts:

 - Click the New button in the toolbar
 - Go through the Create Virtual Machine wizard and use the following settings:
  * Name: Pick a name that will help you distinguish this VM from others like it
  * Type: Linux
  * Version: Ubuntu
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

##Optimizing your virtual machine

Below are optional instructions for optimizing the VM for development. Yes, we could have made a vm that has all this for you, but this is much more fun. Plus you'll know what you have when you're done.

First you'll want to set up quick access to the terminal. Click on the Dash Home icon in the upper left. Search for "Terminal" and drag the terminal icon to the left launch bar. Click it to open the terminal.

#Update Ubuntu

These steps may be especially helpful if you want full screen mode to work correctly on your hardware.

From the terminal:

	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get install dkms
	sudo apt-get install build-essentials

From the VirtualBox menu system, select Devices > Install Guest Additions. Inside the Ubuntu VM, click Run in the dialog box that appears. When the process is done, eject the VirtualBox Additions disk image.

#User Settings

Right-click on the gear icon in the upper right corner of the Linux desktop > System Settings > Brightness and Lock. Turn off Lock, turn off the screen saver, and turn off requiring your password when waking from suspend.

#PG Admin

This is a useful graphical interface for interacting with the Postgresql database

	sudo apt-get install pgadmin3

From Dash Home, drag the pgAdmin icon to your launch bar.

#Chrome

Our preferred web browser because it has excellent built-in debugging tools. You have to actually download it, however:

https://www.google.com/intl/en/chrome

From Dash Home, drag the Chrom icon to your launch bar. Note that if you look in the Ubuntu package repository you'll find Chromium which is similar, but noticably inferior to Chrome.

#Sublime with JSHint installed

This is a nice text editor. It's free, but also also badgerware that will prompt you to pay a nominal purchase registration fee that is worthwhile for the feature set it offers. What is most important here is installing the JSHint add-on which an enormous help for debugging and conforming to xTuple style guidelines. You can get JSHint for a number of other popular editors as well including VIM for those of you who are command line junkies. If you're that kind of dev, though, you probably never bothered with anything on this page.


#Postbooks

