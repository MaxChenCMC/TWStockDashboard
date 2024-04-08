using Sinopac.Shioaji;
using System.Text.Json;

namespace twstockdashboard_backend
{
    public class SJ
    {
        #region login exception handling. 參數是帳密與憑證路徑
        private static Shioaji _api = new Shioaji();

        public void Initialize(string path1, string path2)
        {
            _api = new Shioaji();
            if (!File.Exists(path1) && !File.Exists(path2))
            {
                throw new FileNotFoundException($"File not found: {path1}");
                throw new FileNotFoundException($"File not found: {path2}");
            }

            try
            {
                string jsonString = File.ReadAllText(path1);
                JsonElement root = JsonDocument.Parse(jsonString).RootElement;
                string apiKey = root.GetProperty("API_Key").GetString();
                string secretKey = root.GetProperty("Secret_Key").GetString();
                _api.Login(apiKey, secretKey);
                _api.ca_activate(path2, root.GetProperty("ca_passwd").GetString(), root.GetProperty("person_id").GetString());
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to login to Shioaji API.", ex);
            }
        }
        #endregion


        #region general time setting. 遇週末會換成最近一個交易日；設定SetQuoteCallback終止時間
        private string GetValidDate(string? AssignDate, bool? Fut)
        {
            // 週間休市，只好人工指定前一交易日
            // Kbar用的話，盤後就要T+1，若週五盤後則要T+3，週六凌晨則是T+2，
            if (AssignDate != null) return AssignDate;
            else if (Fut == true)
            {
                DateTime date = DateTime.Now.DayOfWeek switch
                {
                    DayOfWeek.Saturday => DateTime.Now.AddDays(2),
                    DayOfWeek.Sunday => DateTime.Now.AddDays(1),
                    DayOfWeek.Tuesday or DayOfWeek.Wednesday or DayOfWeek.Thursday => (DateTime.Now.Hour >= 15) ? DateTime.Now.AddDays(1) : DateTime.Now,
                    DayOfWeek.Friday => (DateTime.Now.Hour >= 15) ? DateTime.Now.AddDays(3) : DateTime.Now,
                    _ => DateTime.Now
                };
                return date.ToString("yyyy-MM-dd");
            }
            else
            {
                DateTime date = DateTime.Now.DayOfWeek switch
                {
                    DayOfWeek.Saturday => DateTime.Now.AddDays(-1),
                    DayOfWeek.Sunday => DateTime.Now.AddDays(-2),
                    DayOfWeek.Monday => (DateTime.Now.Hour < 9) ? DateTime.Now.AddDays(-3) : DateTime.Now,
                    DayOfWeek.Tuesday => (DateTime.Now.Hour < 9) ? DateTime.Now.AddDays(-1) : DateTime.Now,
                    DayOfWeek.Wednesday => (DateTime.Now.Hour < 9) ? DateTime.Now.AddDays(-1) : DateTime.Now,
                    DayOfWeek.Thursday => (DateTime.Now.Hour < 9) ? DateTime.Now.AddDays(-1) : DateTime.Now,
                    DayOfWeek.Friday => (DateTime.Now.Hour < 9) ? DateTime.Now.AddDays(-1) : DateTime.Now,
                    _ => DateTime.Now
                };
                return date.ToString("yyyy-MM-dd");
            }
        }


        private DateTime GetCallbackEndTime()
        {
            // 是凌晨就05:00停，若盤中就13:45停止，13:45後(常理來說15:00才會開程式)就隔天05:00停止
            bool preMktTime  = DateTime.Now.TimeOfDay < new TimeSpan( 5,  0, 0);
            bool onMktTime   = DateTime.Now.TimeOfDay > new TimeSpan (8, 45, 0) && DateTime.Now.TimeOfDay < new TimeSpan(13, 45, 0);
            DateTime end = preMktTime ?
                           DateTime.Now.Date.AddHours(5) :
                           (onMktTime ? DateTime.Now.Date.AddHours(13.75) : DateTime.Now.Date.AddHours(29));
            return end;
        }
        #endregion

        //===========================================================================

        #region 1. Market index snippet. 台指期、加權、櫃買指數漲跌；以及權益數
        public Dictionary<string, List<object>> NavBar()
        {
            /* 建容器 [key: string] : any[]
             * 前三個裝"指數名稱":[指數、漲跌點、漲跌幅]
             * 後兩個裝裝"項目名稱":[值1、值2]
             */
            Dictionary<string, List<object>> retContainer = new Dictionary<string, List<object>>();

            SJList _IContract = _api.Snapshots(new List<IContract>() {
                _api.Contracts.Futures["TXF"]["TXFR1"],
                _api.Contracts.Indexs["TSE"]["001"],
                _api.Contracts.Indexs["OTC"]["101"]
                });
            foreach (var i in _IContract)
            {
                List<object> _tempIContracts = new List<object>();
                _tempIContracts.Add(i.close);
                _tempIContracts.Add(i.change_price);
                _tempIContracts.Add(i.change_rate);
                retContainer.Add(i.exchange, _tempIContracts);
            }

            var _Margin = _api.Margin();
            List<object> _tempMargins = new List<object>();
            _tempMargins.Add(_Margin.equity_amount);
            _tempMargins.Add(_Margin.available_margin);
            retContainer.Add("Margin", _tempMargins);

            SJList _ListAccounts = _api.ListAccounts();
            List<object> _tempListAccounts = new List<object>();
            _tempListAccounts.Add(_ListAccounts[0].account_id.Substring(4, 3));
            _tempListAccounts.Add(_ListAccounts[1].account_id.Substring(4, 3));
            retContainer.Add("Acct", _tempListAccounts);

            return retContainer;
        }
        #endregion


        #region 2. One minute candlestick 一分K棒
        public Dictionary<DateTime, List<double>> ApexCharts(int LastCount)
        {
            /* 建容器 [key: string] : number[] 裝time stamp : [open, high, low, close]
             *
             */
            string bgn = "";
            string end = "";
            // (週二or週三or週四) && (15:00~23:59) ☛ 迄需+1，起就當日
            // (週五) && (15:00~23:59) ☛ 迄需T+3，起就當日
            // (週六) && (00:00~ 04:59) ☛ 迄需T+2，起就T-1
            // else 起迄都當日
            bool cond1 = DateTime.Now.DayOfWeek == DayOfWeek.Tuesday || DateTime.Now.DayOfWeek == DayOfWeek.Wednesday || DateTime.Now.DayOfWeek == DayOfWeek.Thursday;
            bool cond2 = DateTime.Now.TimeOfDay >= new TimeSpan(15, 0, 0) && DateTime.Now.TimeOfDay <= new TimeSpan(23, 59, 59);
            bool cond3 = DateTime.Now.DayOfWeek == DayOfWeek.Friday && DateTime.Now.TimeOfDay >= new TimeSpan(15, 0, 0);
            bool cond4 = DateTime.Now.DayOfWeek == DayOfWeek.Saturday && DateTime.Now.TimeOfDay <= new TimeSpan(23, 59, 59);
            if (cond1 && cond2)
            {
                end = DateTime.Now.AddDays(+1).ToString("yyyy-MM-dd");
                bgn = DateTime.Now.ToString("yyyy-MM-dd");
            }
            else if (cond3)
            {
                end = DateTime.Now.AddDays(+3).ToString("yyyy-MM-dd");
                bgn = DateTime.Now.ToString("yyyy-MM-dd");
            }
            else if (cond4)
            {
                end = DateTime.Now.AddDays(+2).ToString("yyyy-MM-dd");
                bgn = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");
            }
            else
            {
                end = DateTime.Now.ToString("yyyy-MM-dd");
                bgn = DateTime.Now.ToString("yyyy-MM-dd");
            }

            Dictionary<DateTime, List<double>> retKbarsLastCount = new Dictionary<DateTime, List<double>>();
            object _Kbars = _api.Kbars(_api.Contracts.Futures["TXF"]["TXFR1"], bgn, end);
            var res = _Kbars.ToDict();
            long[] ts = res["ts"].ToArray();
            DateTime[] dateTimes = Array.ConvertAll(ts, x => new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddTicks(x / 100));
            for (int i = 0; i < dateTimes.Length; i++)
            {
                List<double> _tempKbars = new List<double>();
                _tempKbars.Add(res["Open"][i]);
                _tempKbars.Add(res["High"][i]);
                _tempKbars.Add(res["Low"][i]);
                _tempKbars.Add(res["Close"][i]);
                retKbarsLastCount.Add(dateTimes[i], _tempKbars);
            }
            //若 00:00 ~ 00:59 會取不足60筆
            return retKbarsLastCount.TakeLast(LastCount).ToDictionary(x => x.Key, x => x.Value);
        }
        #endregion


        #region 3. Per tick info. 成交明細
        public Dictionary<string, double> Ticks(int LastCount)
        {
            var _TicksQuery = _api.Ticks(_api.Contracts.Futures["TXF"]["TXFR1"], GetValidDate(null, true), TicksQueryType.LastCount, last_cnt: LastCount);
            Dictionary<string, double> _ret = new Dictionary<string, double>();
            for (int i = 0; i < _TicksQuery.ts.ToArray().Length; i++)
            {
                try { _ret.Add(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddTicks(_TicksQuery.ts[i] / 100).ToString("HH:mm:ss"), _TicksQuery.close[i]); }
                catch (Exception ex) { continue; }
            }
            return _ret.OrderByDescending(x => x.Key).ToDictionary(x => x.Key, x => x.Value);
        }
        #endregion


        #region 4. 選擇權複式組合單
        public Dictionary<string, Dictionary<string, double>> Options(string OptionWeek, string yyyyMM, string mode)
        {
            double close = _api.Snapshots(new List<IContract>() { _api.Contracts.Futures["TXF"]["TXFR1"] })[0].close;
            var OPIContract = new List<IContract>();
            if (mode == "4")
            {
                // BC:[][1] - SC:[][0] + BP:[][1], SP:[][0]
                var strikeLower = Math.Floor(close / 50) * 50;
                var strikeUpper = strikeLower + 100;
                OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikeUpper + "C"]);
                OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikeLower + "C"]);
                OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikeUpper + "P"]);
                OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikeLower + "P"]);
            }
            else if (mode == "3")
            {
                // SCSP + BP + MTX
                var strikeUpper = Math.Floor(close / 50) * 50 + 100;
                var strikeLower = strikeUpper - 200;
                var strikeBottom = strikeLower - 200;
                OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikeUpper + "C"]);
                OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikeLower + "P"]);
                OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikeBottom + "P"]);
            }
            else if (mode == "9")
            {
                var strikePar = Math.Floor(close / 50) * 50;
                var strike_300 = strikePar - 300;
                var strike_200 = strikePar - 200;
                var strike_100 = strikePar - 100;
                var strike100 = strikePar + 100;
                var strike200 = strikePar + 200;
                try
                {
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike_300 + "P"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike_200 + "C"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike_200 + "P"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike_100 + "C"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike_100 + "P"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikePar + "C"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strikePar + "P"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike100 + "C"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike100 + "P"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike200 + "C"]);
                    OPIContract.Add(_api.Contracts.Options[OptionWeek][OptionWeek + yyyyMM + strike200 + "P"]);
                }
                catch (Exception ex)
                {
                    //;
                }
            }

            var ret = _api.Snapshots(OPIContract);
            var _ret = new Dictionary<string, Dictionary<string, double>>();
            foreach (var item in ret)
            {
                var code = item.code.Substring(3, 5) + (item.code[8] < 'L' ? "C" : "P");
                if (!_ret.ContainsKey(code)) _ret[code] = new Dictionary<string, double>();
                _ret[code]["buy_price"] = item.buy_price;
                _ret[code]["sell_price"] = item.sell_price;
            }
            return _ret;
        }
        #endregion


        #region 5.部位
        public Dictionary<string, Dictionary<string, object>> GetPositions()
        {
            var res = _api.ListPositions(_api.FutureAccount);

            var _ret = new Dictionary<string, Dictionary<string, object>>();
            for (int i = 0; i < res.Count; i++)
            {
                {
                    var code = res[i].code;
                    _ret[code] = new Dictionary<string, object>();
                    _ret[code]["direction"] = res[i].direction;
                    _ret[code]["quantity"] = res[i].quantity;
                    _ret[code]["price"] = res[i].price;
                    _ret[code]["last_price"] = res[i].last_price;
                    _ret[code]["pnl"] = res[i].pnl;
                }
            }
            return _ret;
        }
        #endregion


        #region 6. 電、金、非金電、漲幅榜的table
        public Dictionary<string, Dictionary<string, object>> StocksTable(string mode)
        {
            List<string> PctRank = _api.Scanners(scannerType: ScannerType.ChangePercentRank, date: GetValidDate(null, null), count: 75)
            .Select(x => (string)x.code).ToList();
            List<string> AmtRank = _api.Scanners(scannerType: ScannerType.AmountRank, date: GetValidDate(null, null), count: 75)
            .Select(x => (string)x.code).ToList();
            var IntersectRank = PctRank.Intersect(AmtRank).ToList();

            List<string> TW30 = new List<string> {
                "2330", "2454", "2317", "2382", "2412", "2881", "2308", "6505", "2882", "2303",
                "3711", "2891", "2886", "1303", "1301", "1216", "2002", "2884", "6669", "5880",
                "3045", "2892", "2207", "2885", "3008", "3231", "1326", "2357", "2603", "3034",
            };
            List<string> Watchlist = IntersectRank.Except(TW30).ToList();

            var _AmtRank = _api.Scanners(scannerType: ScannerType.AmountRank, date: GetValidDate(null, null), count: 75);
            var _ret = new Dictionary<string, Dictionary<string, object>>();
            for (int i = 0; i < _AmtRank.Count; i++)
            {
                if ((mode == "TW30" ? TW30 : Watchlist).Contains(_AmtRank[i].code))
                {
                    var name = _AmtRank[i].name;
                    _ret[name] = new Dictionary<string, object>();
                    _ret[name]["code"] = _AmtRank[i].code;
                    _ret[name]["close"] = _AmtRank[i].close;
                    _ret[name]["price_range"] = _AmtRank[i].price_range;
                    _ret[name]["tick_type"] = _AmtRank[i].tick_type;
                    _ret[name]["change_price"] = _AmtRank[i].change_price;
                    _ret[name]["average_price"] = _AmtRank[i].average_price;
                    _ret[name]["rank_value"] = Math.Round(_AmtRank[i].rank_value / 100_000_000, 2);
                    _ret[name]["buy_price"] = _AmtRank[i].buy_price;
                    _ret[name]["sell_price"] = _AmtRank[i].sell_price;
                }
            }
            var __ret = _ret.Where(x => Convert.ToDouble(x.Value["rank_value"]) >= 5);
            return __ret.Take(15).ToDictionary(x => x.Key, x => x.Value);
        }
        #endregion


        #region 7. 漲靠ScannerType，而「電、金、傳」要靠IContract混Snapshot 漲跌幅K棒比較
        public Dictionary<string, List<double>> ApexChartsOHLC(string target)
        {
            /*
            *選股範圍 電金非金電 vs 漲幅排行，IContract兩種切換
            *轉成{"2330":{"oepn" = 111, "high" = 222, "low" = 333, "close" = 444}, "2454":{"oepn" = 111, "high" = 222, "low" = 333, "close" = 444}}
            *linq過篩後再次轉回 Dictionary<string, Dictionary<string, object>>
            */
            List<string> TENN = new List<string> { "2330", "2454", "2317", "2382", "2308", "2303", "3711", "6669", "3008", "3231" };
            List<string> TFNN = new List<string> { "2881", "2882", "2891", "2886", "2884", "5880", "2892", "2885", "2880", "2890" };
            List<string> XINN = new List<string> { "6505", "1303", "1301", "1216", "2002", "2207", "1326", "2603", "5871", "2912" };
            List<string> ScannersAmountRank = _api.Scanners(scannerType: ScannerType.ChangePercentRank, date: GetValidDate(null, null), count: 30)
            .Select(x => (string)x.code).ToList();

            var SectorComponentsIContract = new List<IContract>();
            if (target == "TENN")
            {
                foreach (string code in TENN) SectorComponentsIContract.Add(_api.Contracts.Stocks["TSE"][code]);
            }
            else if (target == "TFNN")
            {
                foreach (string code in TFNN) SectorComponentsIContract.Add(_api.Contracts.Stocks["TSE"][code]);
            }
            else if (target == "XINN")
            {
                foreach (string code in XINN) SectorComponentsIContract.Add(_api.Contracts.Stocks["TSE"][code]);
            }
            else
            {
                foreach (string code in ScannersAmountRank)
                {
                    Exchange exchange = _api.Contracts.Stocks["TSE"].ContainsKey(code) ? Exchange.TSE : Exchange.OTC;
                    SectorComponentsIContract.Add(_api.Contracts.Stocks[exchange.ToString()][code]);
                };
            }

            Dictionary<string, List<double>> _ret = new Dictionary<string, List<double>>();
            var _Snapshots = _api.Snapshots(SectorComponentsIContract);
            for (int i = 0; i < _Snapshots.ToArray().Length; i++)
            {
                List<double> _tempSnapshots = new List<double>();
                var _lastClose = _Snapshots[i].close - _Snapshots[i].change_price;
                _tempSnapshots.Add(Math.Round(100 * (_Snapshots[i].open - _lastClose) / _lastClose, 2));
                _tempSnapshots.Add(Math.Round(100 * (_Snapshots[i].high - _lastClose) / _lastClose, 2));
                _tempSnapshots.Add(Math.Round(100 * (_Snapshots[i].low - _lastClose) / _lastClose, 2));
                _tempSnapshots.Add(Math.Round(100 * (_Snapshots[i].close - _lastClose) / _lastClose, 2));
                _tempSnapshots.Add(Math.Round(_Snapshots[i].total_amount / 100_000_000d, 0));
                _ret.Add(_Snapshots[i].code, _tempSnapshots);
            }
            var test = _ret.Where(x => x.Value[4] >= 1).Take(15);
            return test.ToDictionary(x => x.Key, x => x.Value);
        }
        #endregion

    }

}
