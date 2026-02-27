# build.ps1
Write-Host "--- 1. 기존 컨테이너 중지 및 정리 ---" -ForegroundColor Cyan
docker-compose down

Write-Host "--- 2. 이미지 빌드 시작 (최적화 적용) ---" -ForegroundColor Cyan
# --build 옵션으로 최신 코드를 반영합니다.
docker-compose build

Write-Host "--- 3. 이미지 버전 태깅 (이슈 #46 요구사항) ---" -ForegroundColor Cyan
$version = "v1.0.0"
docker tag tripdeal-frontend:latest tripdeal-frontend:$version
docker tag tripdeal-backend:latest tripdeal-backend:$version

Write-Host "--- 4. 최종 빌드 결과 확인 ---" -ForegroundColor Green
docker images | Select-String "tripdeal"