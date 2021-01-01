//
//  DetailedViewController.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/5/20.
//  Copyright © 2020 杜思琦. All rights reserved.
//

import UIKit
import SwiftSpinner
import CoreLocation
import Alamofire
import SwiftyJSON
import SwiftSpinner
import AlamofireImage


//MARK: HomeViewController
class DetailedViewController: UIViewController {
    
    let rootUrl = "http://ec2-54-146-190-253.compute-1.amazonaws.com:5000"
    //    let rootUrl = "http://127.0.0.1:5000"
    
    
    @IBOutlet weak var bookmarkButton: UIBarButtonItem!
    @IBOutlet var detailedScrollView: UIView!
    @IBOutlet weak var imgImageView: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    
    @IBOutlet weak var descLabel: UILabel!
    @IBOutlet weak var fullButton: UIButton!
    
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var sectionLabel: UILabel!
    @IBAction func viewFUll(_ sender: UIButton) {
        let shareString = self.anew?.url
        let escapedShareString = shareString!.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!
        let url = URL(string: escapedShareString)
        print(escapedShareString)
        UIApplication.shared.openURL(url!)
    }
    
    @IBAction func addBookmark(_ sender: UIBarButtonItem) {
        
        //show a toast
        //        print("added to bookmark")
        
        var message = ""
        var toastLabel = UILabel()
        var bookmarked = Utils.isContained(articleId: self.articleid!)
        
        if(bookmarked == false){
            message = "Article Bookmarked. Check out the Bookmarks tab to view."
            toastLabel = UILabel(frame: CGRect(x: self.view.frame.size.width/2 - 150, y: self.view.frame.size.height-140, width: 280, height: 50))
            toastLabel.numberOfLines = 2
            self.anew!.favorite = true
            Utils.addBookmark(article_id: self.articleid!)
            self.bookmarkButton.image = UIImage(systemName: "bookmark.fill")
            
        } else{
            message = "Article Removed from Bookmarks."
            toastLabel = UILabel(frame: CGRect(x: self.view.frame.size.width/2 - 150, y: self.view.frame.size.height-115, width: 280, height: 25))
            self.anew!.favorite = false
            Utils.removeBookmark(article_id: self.articleid!)
            self.bookmarkButton.image = UIImage(systemName: "bookmark")
        }
    }
    
    @IBAction func share(_ sender: UIBarButtonItem) {
        //        print("share with twitter in detailed page",self.anew?.title)
        let tweetUrl = self.anew!.url
        let hashtag = "CSCI_571_NewsApp"
        let shareString = "https://twitter.com/intent/tweet?&url=\(tweetUrl)&hashtags=\(hashtag)"
        //        print("shareString",shareString)
        let escapedShareString = shareString.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!
        let url = URL(string: escapedShareString)
        //        print(escapedShareString)
        UIApplication.shared.openURL(url!)
        
    }
    var articleid: String?
    var anew: News?
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // get the article based on articleid
        SwiftSpinner.useContainerView(self.view)
        
        getArticle()
        
    }
    
    func getArticle(){
        //        print("in getArticle function in DetailedArticleVIewController")
        SwiftSpinner.show("Loading Detailed Article...")
        var bookmarked = Utils.isContained(articleId: self.articleid!)
        if (bookmarked == true){
            self.bookmarkButton.image = UIImage(systemName: "bookmark.fill")
        } else {
            self.bookmarkButton.image = UIImage(systemName: "bookmark")
        }
        
        let url = self.rootUrl + "/article?articleid=" + self.articleid!
        Alamofire.request(url).responseJSON {
            response in
            switch response.result {
            case .success:
                let aNew = JSON(response.result.value!)
                SwiftSpinner.hide({
                    //do stuff
                })
                self.anew = News(title:aNew["title"].stringValue,img: aNew["img"].stringValue, date: aNew["time"].stringValue, category: aNew["section"].stringValue, url:aNew["url"].stringValue, articleid: aNew["article_id"].stringValue, description: aNew["description"].stringValue)!
                
                self.titleLabel.text = self.anew?.title
                self.sectionLabel.text = self.anew?.category
                self.dateLabel.text = self.anew?.date
                let html = self.anew!.description
                do {
                    if let data = html.data(using: String.Encoding.unicode, allowLossyConversion: true) {
                        let attStr = try NSAttributedString.init(data: data, options: [NSAttributedString.DocumentReadingOptionKey.documentType : NSAttributedString.DocumentType.html,], documentAttributes: nil)
                        self.descLabel.attributedText = attStr
                    }
                } catch {
                    self.descLabel.text = html
                }
                
                self.fetchImage(imageURL: self.anew?.img)
                
                
            case .failure(let error):
                print(error.localizedDescription)
                SwiftSpinner.hide()
            }
            
        }
    }
    
    func fetchImage(imageURL: String?) {
        let url = imageURL!
        if url == "default-guardian" {
            self.imgImageView.image = UIImage(named: url)!
        } else {
            DispatchQueue.global(qos: .userInitiated).async {
                Alamofire.request(url).responseImage { response in
                    if let image = response.result.value {
                        DispatchQueue.main.async {
                            self.imgImageView.image = image
                        }
                    }
                }
            }
        }
        
    }
}

extension String {
    var htmlToAttributedString: NSAttributedString? {
        guard let data = data(using: .utf8) else { return NSAttributedString() }
        do {
            return try NSAttributedString(data: data, options: [.documentType: NSAttributedString.DocumentType.html, .characterEncoding:String.Encoding.utf8.rawValue], documentAttributes: nil)
        } catch {
            return NSAttributedString()
        }
    }
    var htmlToString: String {
        return htmlToAttributedString?.string ?? ""
    }
}
