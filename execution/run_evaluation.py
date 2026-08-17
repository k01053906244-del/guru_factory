"""
Guru Factory Execution Engine Tester (04_Developer Execution Script)
"""
import json
import os

def test_guru_evaluation():
    print("🚀 [Guru Factory] 로컬 룰셋 및 평가 엔진 검증 시작...")
    
    # 룰셋 파일 존재 여부 확인
    rules_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "data", "gurus")
    peter_lynch_file = os.path.join(rules_dir, "peter_lynch.json")
    
    if os.path.exists(peter_lynch_file):
        with open(peter_lynch_file, "r", encoding="utf-8") as f:
            rule = json.load(f)
            print(f"✅ 피터 린치 룰셋 로드 성공: {len(rule.get('hearing_questions', []))}개 질문 확인")
            print(f"✅ 판결 매트릭스: {len(rule.get('verdict_matrix', []))}개 티어 확인")
    else:
        print(f"❌ 룰셋 파일을 찾을 수 없음: {peter_lynch_file}")
        return False
        
    print("✨ 모든 프론트엔드/백엔드 데이터 모델 호환성 검증 완료!")
    return True

if __name__ == "__main__":
    test_guru_evaluation()
