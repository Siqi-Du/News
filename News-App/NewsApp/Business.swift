//
//  World.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/6/20.
//  Copyright © 2020 杜思琦. All rights reserved.
//
import UIKit
import SwiftSpinner
import CoreLocation
import Alamofire
import SwiftyJSON
import SwiftSpinner
import AlamofireImage
import XLPagerTabStrip

class Business: UITableViewController{
    
    let rootUrl = "http://ec2-54-146-190-253.compute-1.amazonaws.com:5000"
//    let rootUrl = "http://127.0.0.1:5000"
    
    var news : [News] = []
    
    @objc func refresh(sender:AnyObject) {
//        print("refreshing")
     let queue = DispatchQueue(label: "")
     queue.sync{
        let url = self.rootUrl + "/headlines/business"
        Alamofire.request(url).responseJSON {
            response in
            self.news = [News]()
            switch response.result {
            case .success:
                let resp = JSON(response.result.value!)
                let newsArray = resp.arrayValue
                for aNew in newsArray {
                    var myNews = News(title:aNew["title"].stringValue,img: aNew["img"].stringValue, date: aNew["time"].stringValue, category: "| "+aNew["section"].stringValue,url:aNew["url"].stringValue, articleid: aNew["article_id"].stringValue, description: "")
                    self.news.append(myNews!)
                }
                 self.news = Utils.updateFavorites(news: self.news)
                self.tableView.reloadData()
                self.refreshControl!.endRefreshing()
            case .failure(let error):
                print(error.localizedDescription)
                self.refreshControl!.endRefreshing()
            }
        }
    }
}


override func viewDidLoad() {
    super.viewDidLoad()
    self.refreshControl = UIRefreshControl()
    // for refresh
    self.refreshControl!.addTarget(self, action: #selector(self.refresh(sender:)), for: UIControl.Event.valueChanged)
    self.tableView.refreshControl = self.refreshControl

}
    
    override func viewWillAppear(_ animated: Bool) {
        
//        print("in business ")
        getSectionNews()
    }
    
     //MARK:getLatestNews
    func getSectionNews(){
//        print("in getSectionNews function")

        SwiftSpinner.show("Loading BUSINESS Headlines...")
        let url = rootUrl + "/headlines/business"
        Alamofire.request(url).responseJSON {
            response in
            self.news = [News]()
            switch response.result {
            case .success:
                let resp = JSON(response.result.value!)
                SwiftSpinner.hide()
                let newsArray = resp.arrayValue
                
                for aNew in newsArray {
                    var myNews = News(title:aNew["title"].stringValue,img: aNew["img"].stringValue, date: aNew["time"].stringValue, category: "| "+aNew["section"].stringValue, url:aNew["url"].stringValue, articleid: aNew["article_id"].stringValue, description: "")
                    self.news.append(myNews!)
                }
                 self.news = Utils.updateFavorites(news: self.news)
                self.tableView.reloadData()
            case .failure( _):
                SwiftSpinner.hide()
            }
        }
    }
        
    func makeContextMenu(id:Int) -> UIMenu {
             let news = self.news[id]
              let bookmarked = news.favorite
             var image = UIImage(systemName: "bookmark")
            if(bookmarked == true){
                       image = UIImage(systemName: "bookmark.fill")
            }
            
            let share = UIAction(title: "Share with Twitter", image: UIImage(named: "twitter")) { action in
//               print("share with twitter",id)
//                print(self.news[id].title)
                let tweetUrl = self.news[id].url
                let hashtag = "CSCI_571_NewsApp"
                let shareString = "https://twitter.com/intent/tweet?&url=\(tweetUrl)&hashtags=\(hashtag)"
                let escapedShareString = shareString.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!
                let url = URL(string: escapedShareString)
    //            print(escapedShareString)
                UIApplication.shared.openURL(url!)
            }
           
            let bookmark = UIAction(title: "Bookmark", image: image) { action in
//                print("added to bookmark")
               var message = ""
               var toastLabel = UILabel()
               if(bookmarked == false){
                   message = "Article Bookmarked. Check out the Bookmarks tab to view."
                   toastLabel = UILabel(frame: CGRect(x: self.view.frame.size.width/2 - 150, y: self.view.frame.size.height-140, width: 280, height: 50))
                   toastLabel.numberOfLines = 2
                   news.favorite = true
                   Utils.addBookmark(article_id: news.articleid)
                   
               } else{
                   message = "Article Removed from Bookmarks."
                   toastLabel = UILabel(frame: CGRect(x: self.view.frame.size.width/2 - 150, y: self.view.frame.size.height-115, width: 280, height: 25))
                   news.favorite = false
                   Utils.removeBookmark(article_id: news.articleid)
               }
               
               // show Toast
               toastLabel.backgroundColor = UIColor.black.withAlphaComponent(0.9)
               toastLabel.textColor = UIColor.white
               toastLabel.textAlignment = .center;
               toastLabel.text = message
               toastLabel.alpha = 1.0
               toastLabel.layer.cornerRadius = 10;
               toastLabel.clipsToBounds  =  true
               self.view.addSubview(toastLabel)
               UIView.animate(withDuration: 1.0, delay: 0, options: .curveEaseOut, animations: {
                    toastLabel.alpha = 0.8
               }, completion: {(isCompleted) in
                   toastLabel.removeFromSuperview()
               })
               
               self.news = Utils.updateFavorites(news: self.news)
               self.tableView.reloadData()
            }
            // Create and return a UIMenu with the share action
            return UIMenu(title: "Menu", children: [share,bookmark])
        }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?)
    {
//        print("in world prepare")
        if  let detailedViewController = segue.destination as? DetailedViewController,
            let index = self.tableView.indexPathForSelectedRow?.section {
            detailedViewController.title = self.news[index].title
            detailedViewController.articleid = self.news[index].articleid
        }
    }
    
    //MARK: - Table view data source
    override func numberOfSections(in tableView: UITableView) -> Int {
        return self.news.count
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }

     override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
           let cell = tableView.dequeueReusableCell(withIdentifier: "CellBusiness", for: indexPath) as! BusinessTableViewCell

            let new = self.news[indexPath.section]
            cell.fetchImage(imageURL: new.img)
            cell.imgImageView.layer.cornerRadius = 5

            cell.titleLabel.text = new.title
            cell.dateLabel.text = new.date
            cell.categoryLabel.text = new.category

            cell.backgroundColor = UIColor(red: 225/255, green: 225/255, blue: 225/255, alpha: 0.5)
            cell.layer.borderColor  = UIColor.gray.cgColor
            cell.layer.borderWidth = 1
            cell.layer.cornerRadius = 5
        
        //for favorite
          cell.bookmarkButton.addTarget(self, action: #selector(bookmarkButtonClicked(sender:)), for: .touchUpInside)
          cell.bookmarkButton.tag = indexPath.section
          if new.favorite == true {
              cell.bookmarkButton.isSelected = true
          } else {
              cell.bookmarkButton.isSelected = false
          }
               
        
            return cell
    }
    
    //for favorite
    @objc func bookmarkButtonClicked(sender:UIButton){
        //        print("button clicked", sender.tag)
        var message = ""
        var toastLabel = UILabel()
        let news = self.news[sender.tag]
        
        let bookmarked = news.favorite
        if(bookmarked == false){
            message = "Article Bookmarked. Check out the Bookmarks tab to view."
            toastLabel = UILabel(frame: CGRect(x: self.view.frame.size.width/2 - 150, y: self.view.frame.size.height-140, width: 280, height: 50))
            toastLabel.numberOfLines = 2
            news.favorite = true
            Utils.addBookmark(article_id: news.articleid)
            
        } else{
            message = "Article Removed from Bookmarks."
            toastLabel = UILabel(frame: CGRect(x: self.view.frame.size.width/2 - 150, y: self.view.frame.size.height-115, width: 280, height: 25))
            news.favorite = false
            Utils.removeBookmark(article_id: news.articleid)
        }
        
        // show Toast
        toastLabel.backgroundColor = UIColor.black.withAlphaComponent(0.9)
        toastLabel.textColor = UIColor.white
        toastLabel.textAlignment = .center;
        toastLabel.text = message
        toastLabel.alpha = 1.0
        toastLabel.layer.cornerRadius = 10;
        toastLabel.clipsToBounds  =  true
        self.view.addSubview(toastLabel)
        UIView.animate(withDuration: 1.0, delay: 0, options: .curveEaseOut, animations: {
             toastLabel.alpha = 0.8
        }, completion: {(isCompleted) in
            toastLabel.removeFromSuperview()
        })
        
        self.news = Utils.updateFavorites(news: self.news)
        self.tableView.reloadData()
    }

       override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
            return 120.0
        }

        // Set the spacing between sections
       override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
            return 5
        }

       override func tableView(_ tableView: UITableView, contextMenuConfigurationForRowAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
            return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
                return self.makeContextMenu(id:indexPath.section)
            })
        }
}

extension Business:  IndicatorInfoProvider {
    func indicatorInfo(for pagerTabStripController: PagerTabStripViewController) -> IndicatorInfo {
        return IndicatorInfo(title: "BUSINESS")
    }
}

//MARK: CellWorld
class BusinessTableViewCell: UITableViewCell {
    //MARK: Properties
 
    @IBOutlet weak var imgImageView: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var categoryLabel: UILabel!
    
    @IBOutlet weak var bookmarkButton: UIButton!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        // Configure the view for the selected state
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









