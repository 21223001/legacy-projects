import pyautogui
import time
import tkinter as tk
from threading import Thread
import configparser
import os



"""




"""


config = configparser.ConfigParser()
config.read('config.ini')  


# 座標取得クラス
class MousePositionTracker:
    def __init__(self, update_interval):
        self.update_interval = update_interval  
        self.x = 0
        self.y = 0

    def update_position(self):
        self.x, self.y = pyautogui.position()

    def get_position(self):
        return self.x, self.y

    def track_position(self):
        while True:
            self.update_position()
            time.sleep(self.update_interval)
            

# キーボードとマウス操作を行うクラス
class ActionKeyboardAndMouse:
    def __init__(self):
        pass

    def click(self, x, y):
        """ マウスクリックのシミュレーション """
        pyautogui.click(x, y)

    def press_key(self, key):
        """ キーボードキーを押す（仮想的に） """
        pyautogui.write(key)




# 特定の処理を纏めるクラス（今後処理を追加するための空のクラス）
class ActionHandler:
    def __init__(self):
        pass

    # 今後、時間経過後の動作やその他の処理をここに追加する
    def execute_action(self):
        pass
    
    
    
    

# GUIクラスの修正部分
class MouseTrackerGUI:
    def __init__(self, root, tracker, action_handler):
        self.root = root
        self.tracker = tracker
        self.action_handler = action_handler

        # ラベル表示の設定
        self.label = tk.Label(root, text="現在のマウス位置: (0, 0)", font=("Helvetica", 14))
        self.label.grid(row=0, column=0, pady=20, columnspan=2)

        # 文字入力領域とボタン
        self.input_label = tk.Label(root, text="文字を入力:", font=("Helvetica", 12))
        self.input_label.grid(row=1, column=0, pady=5, sticky="w")
        self.input_entry = tk.Entry(root, font=("Helvetica", 12))
        self.input_entry.grid(row=1, column=1, pady=5)

        self.record_button = tk.Button(root, text="記録", command=self.record_coordinates)
        self.record_button.grid(row=2, column=0, pady=5)

        self.clear_button = tk.Button(root, text="クリア", command=self.clear_input)
        self.clear_button.grid(row=2, column=1, pady=5)

        self.coords_label = tk.Label(root, text="座標: (0, 0)", font=("Helvetica", 12))
        self.coords_label.grid(row=3, column=0, pady=5, columnspan=2)

        # 座標記録用リスト（ファイル保存用）
        self.saved_data = []

        # Tabキーで座標取得
        self.root.bind("<Tab>", self.get_coordinates_on_tab)

        # 更新を定期的に行う
        self.update_gui_position()

    def get_coordinates(self):
        """ 現在のマウス位置を取得して表示 """
        x, y = self.tracker.get_position()
        self.coords_label.config(text=f"座標: ({x}, {y})")

    def get_coordinates_on_tab(self, event):
        """ Tabキーが押された時に座標を取得して表示 """
        x, y = self.tracker.get_position()
        self.coords_label.config(text=f"座標: ({x}, {y})")

    def record_coordinates(self):
        """ 入力された文字と座標をファイルに記録 """
        text = self.input_entry.get()
        x, y = self.tracker.get_position()
        if text:
            # ファイルに書き込む
            with open("key_coordinate.txt", "a") as file:
                file.write(f"{text}: ({x}, {y})\n")
            self.saved_data.append((text, x, y))  # リストに保存
            self.clear_input()  # 入力をクリア

    def clear_input(self):
        """ 文字入力と座標をクリア """
        self.input_entry.delete(0, tk.END)
        self.coords_label.config(text="座標: (0, 0)")

    def update_gui_position(self):
        """ 0.5秒ごとにGUIを更新する """
        self.get_coordinates()
        self.root.after(500, self.update_gui_position)  # 0.5秒後に再実行





# メイン（実行）クラス
class MainApp:
    def __init__(self):
        # マウス位置トラッカーのインスタンス作成
        self.tracker = MousePositionTracker(update_interval)
        self.action_handler = ActionKeyboardAndMouse()
        
        # スレッドでマウス位置をトラッキング
        self.tracking_thread = Thread(target=self.tracker.track_position, daemon=True)
        self.tracking_thread.start()

        # GUIの設定
        self.root = tk.Tk()
        self.root.title("Mouse Track")
        self.gui = MouseTrackerGUI(self.root, self.tracker, self.action_handler)

    def run(self):
        """ アプリケーションを実行 """
        self.root.mainloop()


if __name__ == "__main__":
    update_interval = float(config['settings']['update_interval'])

    app = MainApp()
    app.run()
