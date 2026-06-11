-- Chinese name translations for service items, keyed by English item name.
-- One row covers every item across all funeral homes that share the same name.
-- Safe to re-run: CREATE TABLE IF NOT EXISTS + INSERT ... ON CONFLICT DO UPDATE.

CREATE TABLE IF NOT EXISTS item_name_translations (
  item_name  text PRIMARY KEY,
  name_zh    text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE item_name_translations ENABLE ROW LEVEL SECURITY;

-- Anyone can read (needed for share links / public quote views)
CREATE POLICY "public_read" ON item_name_translations
  FOR SELECT USING (true);

-- Only logged-in staff can insert / update
CREATE POLICY "auth_write" ON item_name_translations
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Translations ─────────────────────────────────────────────────────────────
INSERT INTO item_name_translations (item_name, name_zh) VALUES
  -- Professional Staff & Services
  ('Professional Services Fees for Full Service',              '專業及職員服務-傳統服務'),
  ('Professional Services Fees for Gathering Celebrations',   '專業及職員服務-追思服務'),
  ('Professional Services Fees for Memorial Service',         '專業及職員服務-追思服務'),
  ('Professional Services Fees for Graveside Service',        '專業及職員服務-土葬服務'),
  ('Professional Service Fees for Cremation Witness',         '專業及職員服務-見證火化服務'),
  ('Basic Professional Service Fee when Forwarding Remains',  '專業及職員服務-海外運送服務'),
  ('Basic Professional Service Fees when Receiving Remains',  '專業及職員服務-海外運送服務'),
  ('Professional Services Fees for Urn Committal',            '專業及職員服務-骨灰安位服務'),
  ('Basic Service Fees for No Service Option',                '專業及職員服務-直接火化服務'),
  ('Registration and Documentation',                          '註冊及文件手續'),
  ('Embalming',                                               '消毒防腐、美化遺體'),
  ('Sheltering of Remains',                                   '低溫遺體停放'),
  ('Sheltering of Remains – Per Day',                         '低溫遺體停放-一日'),
  ('Other Care and Preparation',                              '更衣、化妝、衛生處理'),
  ('Special Care for Autopsied Cases',                        '解剖後特殊護理'),
  ('Supervision of Disinterment',                             '遺體遷葬'),
  ('Supervision of Funeral Service',                          '專業及職員服務-傳統服務'),
  ('Supervision of Memorial Service',                         '專業及職員服務-追思服務'),
  -- Facilities & Supervision
  ('Use of Facilities for Embalming and Preparation',         '消毒防腐、美化遺體'),
  ('Basic Venue',                                             '場地及現場服務費'),
  ('Standard Venue',                                          '場地及現場服務費'),
  ('Premium Venue',                                           '場地及現場服務費'),
  ('Exclusive Venue',                                         '場地及現場服務費'),
  ('Celebration Gathering',                                   '場地及現場服務費'),
  ('Venue and Staff Services to Coordinate a Simple Gathering', '場地及現場服務費'),
  ('Off-Site Venue & Staff Services',                         '場地及現場服務費'),
  ('Supervision of Off-Site Venue',                           '場地及現場服務費'),
  ('Private Family Moment at our Facility',                   '瞻仰儀容'),
  ('Private Family Moment',                                   '瞻仰儀容'),
  ('Supervision for Visitation Per Hour',                     '瞻仰儀容'),
  ('Supervision - Evening Charge',                            '非辦公時間服務費'),
  ('Supervision - Holiday Charge',                            '非辦公時間服務費'),
  ('Additional Charge - Weekend',                             '非辦公時間服務費'),
  ('Facilities for Visitation',                               '瞻仰儀容'),
  ('Use of Facilities for Visitation – Second Day',           '瞻仰儀容'),
  ('Facilities for Funeral Ceremony',                         '場地及現場服務費'),
  ('Facilities for Memorial Service',                         '場地及現場服務費'),
  ('Basic Venue Service',                                     '場地及現場服務費'),
  ('Standard Venue Service',                                  '場地及現場服務費'),
  ('Premium Venue Service',                                   '場地及現場服務費'),
  ('Signature Exclusive Venue',                               '場地及現場服務費'),
  ('Catered Reception I',                                     '外燴/餐點服務'),
  ('Catered Reception II',                                    '外燴/餐點服務'),
  ('Catered Reception III',                                   '外燴/餐點服務'),
  ('Reception Room',                                          '接待廳 / 茶點室'),
  -- Transportation
  ('Transfer of Remains from Place of Death to Funeral Home', '遺體接送'),
  ('Transfer of Remains from Place of Death',                 '遺體接送'),
  ('Funeral Vehicle (e.g. Hearse)',                           '棺木靈車'),
  ('Funeral Vehicle (Hearse)',                                '棺木靈車'),
  ('Limousine',                                               '禮車'),
  ('Flower Vehicle',                                          '運輸花車'),
  ('Service Vehicle',                                         '服務車'),
  ('Transfer to or from Airport',                             '機場遺體接送'),
  ('Shipping Administration',                                 '海外遺體運輸文件費'),
  ('Handling and Transfer of Ashes',                          '骨灰處理費'),
  ('Additional Hours – Transportation',                       '接送超時費'),
  -- Family Support Options
  ('Medallion Bundle',                                        '紀念徽章'),
  ('Timeless Touch Fingerprint',                              '指紋紀念品'),
  ('Funeral Webcasting',                                      '禮堂直播'),
  ('Retractable Table Banner',                                '伸縮展示立牌'),
  ('Legal Service Plan',                                      '法律諮詢服務'),
  ('Memory Portrait - 10x15 Framed Canvas Portrait',          '靈堂相片'),
  ('Memory Portrait',                                         '靈堂相片'),
  ('Treasure Kits',                                           '祭祀禮包（ex. 紙錢、房子）'),
  ('Family Estate Manager',                                   '家屬遺產事務指南平台'),
  ('Estate Fraud Protection',                                 '政府機構通知及身分盜用保障'),
  ('Everlasting Memorial',                                    '照片／幻燈片'),
  ('Traditional Ritual Washing',                              '傳統清洗'),
  ('Plan Support Option',                                     '項目（可選）'),
  ('Cremation Plan Support Option',                           '項目（可選）'),
  -- Miscellaneous Services & Merchandise
  ('Custom Service Folders (100)',                            '儀式卡片'),
  ('Sterling Silver Oval Pendant',                            '紀念首飾'),
  ('A Life Remembered Book',                                  '紀念相簿'),
  ('A Life Remembered Book (Soft Cover)',                     '紀念相簿'),
  ('A Life Remembered Book (Hardcover)',                      '紀念相簿'),
  ('Cremation Expediting Fee',                                '火化加急處理費'),
  ('Cremation Witnessing Fee',                                '見證火化費'),
  ('Crematory Fee',                                           '火化費'),
  ('Reception and Hostess',                                   '接待廳 / 茶點室 / 接待人員'),
  ('Burial Flowers',                                          '花'),
  ('Cremation Flowers',                                       '花'),
  ('Air Tray',                                                '航空運輸外箱'),
  ('Shipping Container',                                      '運輸外箱'),
  ('Shipping Crate for Calgary Liner',                        '運輸外箱'),
  ('Calgary Liner',                                           '運輸外箱'),
  -- Stationery
  ('Remembrance Collection',                                  '簽到簿冊, 儀式卡, 感謝卡'),
  ('Our Collection',                                          '簽到簿冊, 儀式卡, 感謝卡'),
  ('Commemorative Collection',                                '簽到簿冊, 儀式卡, 感謝卡'),
  ('Esteemed Collection',                                     '簽到簿冊, 儀式卡, 感謝卡'),
  ('Personal Collection',                                     '簽到簿冊, 儀式卡, 感謝卡'),
  ('Signature Series',                                        '簽到簿冊, 儀式卡, 感謝卡'),
  -- Cash Advances
  ('Consumer Protection BC Fee',                              '政府註冊手續費'),
  ('Death Certificate (each)',                                 '一份死亡證明'),
  ('CPBC Fee',                                                '政府註冊手續費'),
  -- Journey Home
  ('Journey Home Travel Protection',                          '旅遊保障-愛回家')
ON CONFLICT (item_name) DO UPDATE
  SET name_zh = EXCLUDED.name_zh, updated_at = now();
