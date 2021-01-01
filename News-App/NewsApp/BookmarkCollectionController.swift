//
//  BookmarkCollectionController.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/7/20.
//  Copyright © 2020 杜思琦. All rights reserved.
//

import UIKit
import SwiftSpinner
import CoreLocation
import Alamofire
import SwiftyJSON
import SwiftSpinner
import AlamofireImage

class BookmarkCollectionController: UIViewController {
    
    let rootUrl = "http://ec2-54-146-190-253.compute-1.amazonaws.com:5000"
//        let rootUrl = "http://127.0.0.1:5000"
    
    let cellIdentifier = "BookmarkCollectionViewCell"
    
    @IBOutlet weak var bookmarkCollectionView: UICollectionView!
    
    var flowLayout = UICollectionViewFlowLayout()
    
    var anew: News?
    var news = [News]()
    
    func setupCollectionView(){
        self.bookmarkCollectionView.delegate = self
        self.bookmarkCollectionView.dataSource = self
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
//        self.setCellSize()
    }
    
    func setCellSize (){
        if self.flowLayout == nil {
            let numberOfItemPerRow = 2
            let lineSpace = CGFloat(5)
            let itemSpace = CGFloat(5)
            self.flowLayout = UICollectionViewFlowLayout()
//            self.flowLayout.itemSize = CGSize(width:100,height:100)
            self.flowLayout.sectionInset = UIEdgeInsets.zero
            self.flowLayout.scrollDirection = .vertical
            self.flowLayout.minimumLineSpacing = lineSpace
            self.flowLayout.minimumInteritemSpacing = itemSpace
            self.bookmarkCollectionView.setCollectionViewLayout(self.flowLayout, animated: true)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        SwiftSpinner.useContainerView(self.view)
        getBookmarks()
        self.setupCollectionView()
    }
    
    func getBookmarks(){
//        print("in getBookmarks function")
        var favorites = UserDefaults.standard.array(forKey: "favorites")!
        self.news = [News]()
        if(favorites.count == 0){
            self.setEmptyMessage("No bookmarks added")
        } else {
//            let queue = DispatchQueue(label: "")
//                queue.sync{
            SwiftSpinner.show("Loading Bookmarks...")
            for i in 0...favorites.count-1{
                var fav = favorites[i] as! String
                let url = self.rootUrl + "/article?articleid=" + fav
                SwiftSpinner.show("Loading Bookmarks...")
                Alamofire.request(url).responseJSON {
                   response in
                   switch response.result {
                   case .success:
                    let queue = DispatchQueue(label: "")
                    queue.sync{
                       let aNew = JSON(response.result.value!)
                      
                       var myNews = News(title:aNew["title"].stringValue,img: aNew["img"].stringValue, date: aNew["time"].stringValue, category: "| "+aNew["section"].stringValue, url:aNew["url"].stringValue, articleid: fav, description: "")!
                        print("hahahhaha\(myNews.articleid)")
                        myNews.setBookmark(tag: true)
                       
                       self.news.append(myNews)
                        self.bookmarkCollectionView.reloadData()
                        SwiftSpinner.hide()
                    }
                           case .failure(let error):
                               print(error.localizedDescription)
                               SwiftSpinner.hide()
                    }
                }
                    
            }
        }

    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "ida"{
            if let detailedViewController = segue.destination as? DetailedViewController{
                let cell = sender as! UICollectionViewCell
                let index = self.bookmarkCollectionView.indexPath(for: cell)!.row
                detailedViewController.title = self.news[index].title
                detailedViewController.articleid = self.news[index].articleid
            }
        }
    }
    
    
    
    func setEmptyMessage(_ message: String) {
        let messageLabel = UILabel(frame: CGRect(x: 100, y: 100, width: 300, height: 21))
        messageLabel.text = message
        messageLabel.textColor = .black
        messageLabel.numberOfLines = 0;
        messageLabel.textAlignment = .center;
        messageLabel.sizeToFit()
        self.bookmarkCollectionView.backgroundView = messageLabel;
        self.bookmarkCollectionView.reloadData()
    }

    func restore() {
        self.bookmarkCollectionView.backgroundView = nil
        self.bookmarkCollectionView.reloadData()
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
               
               self.news = Utils.updateNews(news: self.news)
               self.bookmarkCollectionView.reloadData()
            }
            // Create and return a UIMenu with the share action
            return UIMenu(title: "Menu", children: [share,bookmark])
        }


}

extension BookmarkCollectionController: UICollectionViewDelegate, UICollectionViewDataSource {
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
//        print("in cellForItemAt total\(self.news.count)个")
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: self.cellIdentifier, for: indexPath) as! BookmarkCollectionViewCell
        
        let new = self.news[indexPath.row]
        print(new.title)
       cell.titleLabel.text = new.title
       cell.fetchImage(imageURL: new.img)
       cell.imgImageView.layer.cornerRadius = 5
        cell.dateLabel.text = new.date
       cell.categoryLabel.text = new.category
       
       cell.backgroundColor = UIColor(red: 225/255, green: 225/255, blue: 225/255, alpha: 0.5)
       cell.layer.borderColor  = UIColor.gray.cgColor
       cell.layer.borderWidth = 1
       cell.layer.cornerRadius = 5
       
//       //for favorite
        cell.bookmarkButton.addTarget(self, action: #selector(bookmarkButtonClicked(sender:)), for: .touchUpInside)
        cell.bookmarkButton.tag = indexPath.row
        if new.favorite == true {
            cell.bookmarkButton.isSelected = true
        } else {
            cell.bookmarkButton.isSelected = false
        }
        return cell
    }
    
    //for favorite
    @objc func bookmarkButtonClicked(sender:UIButton){
        print("button clicked in collection", sender.tag)
        var message = ""
        var toastLabel = UILabel()
        let news = self.news[sender.tag]
        
        let bookmarked = news.favorite
        print("bookmarked:\(bookmarked)")
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
            print(news.articleid)
            Utils.removeBookmark(article_id: news.articleid)
            
            self.news = Utils.updateNews(news:self.news)
            self.bookmarkCollectionView.reloadData()
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
        
        self.bookmarkCollectionView.reloadData()
    }

    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {

//        print("in numberOfItemsInSection with self.news.count",self.news.count)
        if (self.news.count == 0) {
            self.setEmptyMessage("No bookmarks added.")
        } else {
            self.restore()
        }
        return self.news.count
    }
    
    
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        //        print("you selected \(indexPath)")
    }
    
    func collectionView(_ collectionView: UICollectionView, contextMenuConfigurationForItemAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
            // "puppers" is the array backing the collection view
            return self.makeContextMenu(id:indexPath.row)
        })
    }
    
    
}




