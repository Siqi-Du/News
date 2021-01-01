//
//  HomeViewController.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/2/20.
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
class HomeViewController: UIViewController, CLLocationManagerDelegate {
    
    //    let rootUrl = "http://ec2-54-146-190-253.compute-1.amazonaws.com:5000"
    let rootUrl = "http://127.0.0.1:5000"
    
    let weatherKey = "0194698ac0dda6dc1149996970717861"
    let locManager = CLLocationManager()
    var city:String? = ""
    var state:String? = ""
    var weather:String? = ""
    var temp:String? = ""
    
    //MARK: Properties weather
    @IBOutlet weak var weatherImageView: UIImageView!
    @IBOutlet weak var cityLabel: UILabel!
    @IBOutlet weak var tempLabel: UILabel!
    @IBOutlet weak var stateLabel: UILabel!
    @IBOutlet weak var weatherLabel: UILabel!
    
    //MARK: Properties table view
    @IBOutlet weak var homeTableView: UITableView!
    @IBOutlet weak var headerView: UIView!
    
    
    
    var news = [News]()
    let refreshControl = UIRefreshControl()
    
    @objc func refresh(sender:AnyObject) {
        //        print("refreshing")
        let queue = DispatchQueue(label: "")
        queue.sync{
            let url = self.rootUrl + "/latest"
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
                    self.homeTableView.reloadData()
                    self.refreshControl.endRefreshing()
                case .failure(let error):
                    print(error.localizedDescription)
                    self.refreshControl.endRefreshing()
                }
            }
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        SwiftSpinner.useContainerView(self.view)
        
    }
    //MARK: viewDidLoad()
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "home"
        
        //get user uuid when first run
        let userid = UserDefaults.standard.string(forKey: "newsapp")
        if(userid == nil){
            
            let uuid_ref = CFUUIDCreate(nil)
            let uuid_string_ref = CFUUIDCreateString(nil , uuid_ref)
            let uuid = uuid_string_ref! as String
            UserDefaults.standard.set(uuid, forKey: "newsapp")
        }
        //        print("uuid",UserDefaults.standard.string(forKey: "newsapp")!)
        UserDefaults.standard.set([], forKey: "favorites")
        
        Thread.sleep(forTimeInterval: 1.0)
        //        SwiftSpinner.useContainerView(self.view)
        self.getLatestNews()
        
        weatherImageView.layer.cornerRadius = 5
        //get location
        locManager.delegate = self
        locManager.requestAlwaysAuthorization()
        //      locManager.requestWhenInUseAuthorization()
        if (CLLocationManager.locationServicesEnabled()){
            locManager.startUpdatingLocation()
        }
        
        self.homeTableView.tableHeaderView = headerView
        
        homeTableView.dataSource = self
        homeTableView.delegate = self
        
        // for refresh
        self.refreshControl.addTarget(self, action: #selector(self.refresh(sender:)), for: UIControl.Event.valueChanged)
        self.homeTableView.refreshControl = self.refreshControl
        
        
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?)
    {
        if  let detailedViewController = segue.destination as? DetailedViewController,
            let index = self.homeTableView.indexPathForSelectedRow?.section {
            detailedViewController.title = self.news[index].title
            detailedViewController.articleid = self.news[index].articleid
        }
    }
    
    
    //MARK: locationManager
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        //        print("inside locationManager function")
        
        let currentLocation = locations.last!
        let geocoder = CLGeocoder()
        
        // Look up the location and pass it to the completion handler
        geocoder.reverseGeocodeLocation(currentLocation) { (placemarks, error) in
            let loc = placemarks?[0]
            self.city = loc!.locality!
            self.state = loc!.administrativeArea!
            let c = self.city!.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
            let url = "https://api.openweathermap.org/data/2.5/weather?q=\(c)&units=metric&appid=\(self.weatherKey)"
            print(url)
            Alamofire.request(url).responseJSON {
                response in
                
                let resp = JSON(response.result.value!)
                self.weather = resp["weather"][0]["main"].stringValue
                self.temp = String(Int(round(resp["main"]["temp"].doubleValue)))
                
                self.cityLabel.text = self.city!
                self.stateLabel.text = self.state!
                self.tempLabel.text = "\(self.temp!)℃"
                self.weatherLabel.text = self.weather!
                
                if self.weather == "Clouds" {
                    self.weatherImageView.image = UIImage(named: "cloudy_weather.jpg")
                } else if self.weather == "Clear" {
                    self.weatherImageView.image = UIImage(named: "clear_weather.jpg")
                } else if self.weather == "Snow" {
                    self.weatherImageView.image = UIImage(named: "snowy_weather.jpg")
                } else if self.weather == "Rain" {
                    self.weatherImageView.image = UIImage(named: "rainy_weather.jpg")
                } else if self.weather == "Thunderstorm" {
                    self.weatherImageView.image = UIImage(named: "thunder_weather.jpg")
                } else {
                    self.weatherImageView.image = UIImage(named: "sunny_weather.jpg")
                }
            }
        }
        self.locManager.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print(error.localizedDescription)
    }
    
    
    //MARK:getLatestNews
    func getLatestNews(){
        //        print("in getLatestNews function")
        
        SwiftSpinner.show("Loading Home Page...")
        //         self.tabBarController?.tabBar.isHidden = true
        let url = self.rootUrl+"/latest"
        Alamofire.request(url).responseJSON {
            response in
            self.news = [News]()
            switch response.result {
            case .success:
                let resp = JSON(response.result.value!)
                SwiftSpinner.hide({
                    //                     self.tabBarController?.tabBar.isHidden = false
                })
                let newsArray = resp.arrayValue
                
                //load the newsArray to news:News
                for aNew in newsArray {
                    var myNews = News(title:aNew["title"].stringValue,img: aNew["img"].stringValue, date: aNew["time"].stringValue, category: "| "+aNew["section"].stringValue, url:aNew["url"].stringValue, articleid: aNew["article_id"].stringValue, description: "")
                    self.news.append(myNews!)
                }
                
                self.news = Utils.updateFavorites(news: self.news)
                self.homeTableView.reloadData()
            case .failure(let error):
                print(error.localizedDescription)
                SwiftSpinner.hide()
                //                self.tabBarController?.tabBar.isHidden = false
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
            print("share with twitter",id)
            print(self.news[id].title)
            let tweetUrl = self.news[id].url
            let hashtag = "CSCI_571_NewsApp"
            let shareString = "https://twitter.com/intent/tweet?&url=\(tweetUrl)&hashtags=\(hashtag)"
            let escapedShareString = shareString.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!
            let url = URL(string: escapedShareString)
            //            print(escapedShareString)
            UIApplication.shared.openURL(url!)
        }
        
        let bookmark = UIAction(title: "Bookmark", image: image) { action in
            //            print("added to bookmark")
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
            self.homeTableView.reloadData()
        }
        // Create and return a UIMenu with the share action
        return UIMenu(title: "Menu", children: [share,bookmark])
    }
    
}

extension HomeViewController: UITableViewDelegate, UITableViewDataSource {
    
    //MARK: - Table view data source
    func numberOfSections(in tableView: UITableView) -> Int {
        return self.news.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        //        print("in tableView -> cellForRowAt", indexPath)
        // Table view cells are reused and should be dequeued using a cell identifier.
        let cellIdentifier = "HomeTableViewCell"
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath) as? HomeTableViewCell  else {
            fatalError("The dequeued cell is not an instance of MealTableViewCell.")
        }
        
        //        print(indexPath.section)
        // Fetches the appropriate meal for the data source layout.
        let new = self.news[indexPath.section]
        
        cell.titleLabel.text = new.title
        cell.fetchImage(imageURL: new.img)
        cell.imgImageView.layer.cornerRadius = 5
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
        self.homeTableView.reloadData()
    }
    
    
    //MARK: UITableViewDelegate
    // set cell height
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 120.0
    }
    //call this method after select a cell
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        //        print("You tapped cell number \(indexPath.section).")
        
        //            let mainStoryboard = UIStoryboard(name: "Main", bundle: nil)
        //            let detailedViewController = mainStoryboard.instantiateViewController(withIdentifier: "DetailedViewController") as! DetailedViewController
        //            let cell = tableView.cellForRow(at: indexPath) as! HomeTableViewCell
        //
        //            print(news[indexPath.section].url)
        //            detailedViewController.img = cell.imageView?.image
        //            detailedViewController.newsTitle = news[indexPath.section].title
        ////            detailedViewController.newsDescription = news[indexPath.section].details
        //            detailedViewController.section = news[indexPath.section].category
        //            detailedViewController.date = news[indexPath.section].date
        //
        //            self.present(detailedViewController, animated: true)
        
    }
    
    // Set the spacing between sections
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 5
    }
    
    // Make the background color show through
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = UIView()
        headerView.backgroundColor = UIColor.clear
        return headerView
    }
    
    func tableView(_ tableView: UITableView, contextMenuConfigurationForRowAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        
        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
            // "puppers" is the array backing the collection view
            return self.makeContextMenu(id:indexPath.section)
        })
    }
    
    
    
}


