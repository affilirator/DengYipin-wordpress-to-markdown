---
title: 'How to add/integrate PesaPal Payment Gateway to WHMCS'
description: ""
pubDate: 2015-03-21
redirect_from:
            - https://mahinge.com/how-to-addintergrate-pesapal-payment-gateway-to-whmcs/
tags: ["make money blogging", "Affiliate Marketing", "web hosting"]
image: /blog/post-01-cover.png
---
For the past few days, I have been cooking something spicy on [Blogscheme](https://mahinge.com "Blogscheme"). Bit by bit, ingredient by ingredient, I have proceeded to build the only web hosting company that will allow you to scale your business at no extra charges on you.

The process has been painstaking and has gone on for close to one week now.

I first had to shop for a VPS server that will be lighting fast, which reminds me I need to write that article about shopping for VPS servers.

After finding the VPS hosting that suits my business model and making the initial payments, I had to choose a billing management software. Among the many client management systems available on the internet, I settled on [WHMCS](https://mahinge.com/wp-content/uploads/2015/03/www.whmcs.com "WHMCS"). It is the popular choice among web hosting companies, and a quick demo test drive assured me that this is what I needed.

With everything set up and ready to go, it has come to a point where I need to add a payment gateway for the web hosting services, and I have had to weigh my options.

## Researching the Best Payment Processor for WHMCS

A client/billing management software is used to automate billing. With such a software, you can easily set up accounts for your web hosting clients and go for a vacation to the moon without worrying that you are not there to bill or set up accounts for your customers.

There are several client management software available on the internet including WHMCS (which is what I am using on Blogscheme Web Hosting), BoxBilling, Clientexec among others.

However, no matter how robust a client management system is, it still needs to work with a payment gateway/payment processor.

Since I have opted to use WHMCS as my client management software, I have to choose between these three payment gateways:

1.  2Checkout
2.  PayPal, and
3.  Skrill/Moneybookers \[sic]
4.  PesaPal

Of course there are other payment gateways available out there, but depending on who I anticipate my clients to be, I opted for the above 3.

However, I had to cancel out Skrill/Moneybookers from the list very fast. Apparently, [a Skrill Merchant account is a pain in the umentionable](https://mahinge.com/wp-content/uploads/2015/03/Why-nobody-uses-Moneybookers-now-called-Skrill-anymore-Whats-wrong-with-this-payment-system). This does not mean that you cannot use Skrill to receive payments from your freelance gigs. [SkrilliT](https://mahinge.com/best-way-to-withdraw-money-paypal-kenya/ "Skrill to Mpesa") makes that side of thing all-so-awesome.

I also had to cancel out PayPal from my list of prospective payment processors. The way I see it, most of my clients are newbie in online commerce and are unlikely to have any money on their PayPal accounts. I might still decide to use PayPal at a later date when I have done thorough analysis of the market.

I have managed to narrow down the payment processors to two: PesaPal and 2Checkout. There are two great payment processors. Although I have heard some nasty things about 2Checkout on the [Web Hosting Talk Forums](www.webhostingtalk.com/ "WHT"), that is what ultimately leads me to choose PesaPal over it.

- PesaPal has lower transaction costs than 2Checkout
- PesaPal has a local ring on it. This might end up working to my advantage since I am mostly targeting upcoming Kenyan bloggers with my web hosting services.
- Arghh. The registration process on 2Checkout was the last nail that bang-shut that coffin. I understand that the process is necessary, more so since 2Checkout is global. Add Eastern Europe and Nigerian Hackers in the equation and I totally understand the long registration process
- I already use PesaPal to sell some products on Blogscheme, which means no learning curve for me here.

## Using the PesaPal Module for WHMCS?

How did I even know that PesaPal has an addon/module for WHMCS?

I still smile when I remember how I came across this useful bit of information. I was researching other companies that offer web hosting services in Kenya when I came across the nugget.

Before I venture into any business, I like to do a thorough competitor analysis. I want to know who I am against. I want to see what my competitors' Goliath and their Heel of Achilles is. I want to test out every system that they are using, and see how they fair against what I have. It was in the process of this research that I came across a web hosting company that is using WHMCS and accepting payments via PesaPal. That was my _Eureka!_ moment. Google took care of everything else from there.

## Installing the PesaPal WHMCS Module

In my rush to have PesaPal's WHMCS payment gateway up and running as fast as I could, I made a mistake that took me a few minutes to diagnose. Instead of uploading the unzipped file to the _Modules/Gateways_ directory of my WHMCS directory, I uploaded it in the _Modules/Addons_ directory. I spent a few minutes wondering why I couldn't see the option to activate it. After a few minutes of ruthless head-scratching and feeling completely useless, I went back and read the ReadMe file that comes with PesaPal WHMCS addon. Don't repeat the same mistake.

Here is the proper way to install PesaPal WHMCS addon:

1.  Download the package from [WHMCS Appstore](https://mahinge.com/wp-content/uploads/2015/03/PesaPal.html) or from [PesaPal's Official Extensions Directory](https://mahinge.com/wp-content/uploads/2015/03/official-extensions)
2.  Unzip the package to a folder in your computer. This step will unzip the main folder _'PesaPal WHMCS'_. You will upload the contents of this folder separately via your FTP software.
3.  Grab the _PesaPal folder_ (this is a sub-folder inside the main _PesaPal WHMCS folder_) and the _pesapal.php_ file and upload them in the WHMCS _modules/gateways_ directory.
4.  Grab the _PesaPal.php_ file from the _callback folder_ and upload it into _Modules/gateways/callbacks_ directory of your main WHMCS installation
5.  Open the templates folder of your downloaded/unzipped package. Grab the pesapal_callback.tpl and pesapla_iframe.tpl and upload them into your WHMCS templates directory.
6.  Head over to setup-payments-payments gateway on admin section of your WHMCS installation and enable PesaPal. It will probably be at the bottom of the list. Enter your WHMCS username and the Consumer Secret and API key from PesaPal and click save.

You have eaten the largest part of the pie. Don't forget to try payments on a demo account before you roll it out on a live account. PesaPal provides sandbox to test payments before you take it live. [Open your demo account here](https://mahinge.com/wp-content/uploads/2015/03/demo.pesapal.com).

Don't forget to replace your API credentials with your live account details when you are done with testing on the demo account.

I am still running tests with the PesaPal WHMCS addon, and closing my fingers that everything works out right.

Till next time. I am still yours faithfully, Patoh.
