//
//  TrendingController.swift
//  NewsApp
//
//  Created by 杜思琦 on 5/6/20.
//  Copyright © 2020 杜思琦. All rights reserved.
//
import UIKit
import Alamofire
import SwiftyJSON
import SwiftSpinner
import Charts

class TrendingViewController: UIViewController, UITextFieldDelegate {
    let rootUrl = "http://ec2-54-146-190-253.compute-1.amazonaws.com:5000"
//    let rootUrl = "http://127.0.0.1:5000"
       
    //MARK: Properties
    
    @IBOutlet weak var chartView: LineChartView!
    @IBOutlet weak var searchText: UITextField!
    
    var numbers : [Double] = []
    
    //MARK: viewDidLoad()
    override func viewDidLoad() {
        super.viewDidLoad()
        searchText.delegate = self
        getData(q: "Coronavirus")
   
    }
    
    func getData(q:String){
        let url = self.rootUrl + "/trends?q=" + q
        Alamofire.request(url).responseJSON {
            response in
           
            switch response.result {
            case .success:
                let resp = JSON(response.result.value!)
                print(resp.type)
                self.updateGraph(data: resp.arrayObject as! [Double])
                
            case .failure(let error):
                print(error.localizedDescription)
            }
        }
    }
    
    
    func updateGraph(data:[Double]){
        var lineChartEntry  = [ChartDataEntry]()

        for i in 0..<data.count {
            let value = ChartDataEntry(x: Double(i), y: data[i])
            lineChartEntry.append(value)
        }

        let txt: String
        if (self.searchText.text! == "") {
            txt = "Coronavirus"
        } else {
            txt = self.searchText.text!
        }
        
        let line = LineChartDataSet(entries: lineChartEntry, label: "Trending Chart for \(txt)")
        
        line.colors = [NSUIColor.blue]
        line.circleColors = [NSUIColor.blue]
        line.circleRadius = 4

        let data = LineChartData()
        data.addDataSet(line)
        chartView.data = data
    }
    
    
    //MARK: UITextFieldDelegate
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        // Hide the keyboard.
        textField.resignFirstResponder()
        return true
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        print(textField.text!)
        getData(q: textField.text!)
    }
}
